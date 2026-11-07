/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const ts = require("typescript");

require.extensions[".ts"] = function compileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

// Resolve the project's "@/" alias so real catalogue modules can be tested directly.
const Module = require("node:module");
const path = require("node:path");
const root = path.resolve(__dirname, "../..");
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function resolveAlias(request, ...rest) {
  return resolveFilename.call(this, request.startsWith("@/") ? path.join(root, request.slice(2)) : request, ...rest);
};

const pricing = require("./pricing.ts");
const { provisionalPricing, ILLUSTRATIVE_BUNDLE_DISCOUNT_PERCENT, illustrativeBundlePercents } = require("./preview-pricing.ts");
const { collectionSearchKeywords, comboItemNotes, productSearchKeywords, searchSuggestions } = require("../content/sale.ts");
const { buildSearchIndex, highlightMatches, searchProducts } = require("./product-search.ts");
const { catalogPreviewProducts } = require("../content/catalog-preview.ts");
const { productImages } = require("../content/product-images.ts");
const { filterSaleProducts, defaultSaleFilters, getDiscountOptions } = require("./sale-filters.ts");
const { buildSaleSnapshot } = require("./sale-catalog.ts");
const config = require("./sale-config.ts");

// Controlled fixtures only; these are not real Aram Narpavi prices.
const NOW = Date.parse("2026-11-10T06:00:00Z");
const verified = (sellingPrice, extra = {}) => ({ status: "verified", variantId: "fixture-variant", packSize: "100 g", sellingPrice, referencePrice: null, availability: "in-stock", ...extra });
const promotion = (overrides = {}) => ({
  id: "fixture-promo", enabled: true, approved: true, title: "Fixture", customerCopy: "Fixture",
  discount: { type: "percentage", percent: 12 }, productIds: ["soap-a", "soap-b", "malt"], bundleIds: [],
  excludedProductIds: [], startsAt: "2026-11-01T00:00:00Z", endsAt: "2026-11-15T00:00:00Z",
  couponCode: null, minimumQuantity: null, minimumOrderValue: null, stacking: "exclusive", ...overrides,
});
const view = (id, name, offer, collectionSlug = "herbal-soaps") => ({ id, name, href: `/products/${id}`, collectionSlug, image: null, offer });
const priced = (finalPrice, extra = {}) => ({ kind: "priced", packSize: "100 g", availability: "in-stock", finalPrice, originalPrice: null, mrp: null, savings: 0, discountPercent: 0, promotionId: null, ...extra });

test("discount calculation rounds half-up to the rupee and floors the displayed percentage", () => {
  const offer = pricing.resolveProductOffer("soap-a", verified(14900), [promotion()], NOW);
  // 149 x 0.88 = 131.12 -> ₹131
  assert.equal(offer.finalPrice, 13100);
  assert.equal(offer.originalPrice, 14900);
  assert.equal(offer.savings, 1800);
  assert.equal(offer.discountPercent, 12);
  assert.equal(pricing.roundToRupee(13150), 13200);
  assert.equal(pricing.discountPercentOf(10000, 8850), 11);
});

test("offers apply only inside the [start, end) window", () => {
  const promo = promotion();
  assert.equal(pricing.isPromotionLive(promo, Date.parse("2026-10-31T23:59:59Z")), false);
  assert.equal(pricing.isPromotionLive(promo, Date.parse("2026-11-01T00:00:00Z")), true);
  assert.equal(pricing.isPromotionLive(promo, Date.parse("2026-11-14T23:59:59Z")), true);
  assert.equal(pricing.isPromotionLive(promo, Date.parse("2026-11-15T00:00:00Z")), false);
  const expired = pricing.resolveProductOffer("soap-a", verified(14900), [promo], Date.parse("2026-11-16T00:00:00Z"));
  assert.equal(expired.finalPrice, 14900);
  assert.equal(expired.originalPrice, null);
});

test("disabled, unapproved, undated or over-ceiling promotions never apply", () => {
  for (const promo of [
    promotion({ enabled: false }),
    promotion({ approved: false }),
    promotion({ startsAt: null }),
    promotion({ endsAt: null }),
    promotion({ discount: { type: "percentage", percent: 20 } }),
  ]) {
    assert.equal(pricing.resolveProductOffer("soap-a", verified(14900), [promo], NOW).promotionId, null);
  }
});

test("excluded products never receive a discount", () => {
  const offer = pricing.resolveProductOffer("soap-a", verified(14900), [promotion({ excludedProductIds: ["soap-a"] })], NOW);
  assert.equal(offer.promotionId, null);
  assert.equal(offer.savings, 0);
});

test("unverified or inconsistent pricing stays unpriced", () => {
  assert.equal(pricing.resolveProductOffer("x", undefined, [], NOW).kind, "unpriced");
  assert.equal(pricing.resolveProductOffer("x", { status: "unverified", reason: "pending" }, [], NOW).kind, "unpriced");
  // MRP below selling price, as recorded for Instant Moringa Soup Mix.
  const inconsistent = pricing.resolveProductOffer("x", verified(16900, { referencePrice: 15900 }), [], NOW);
  assert.equal(inconsistent.kind, "unpriced");
});

test("out-of-stock products show a price but no promotional discount", () => {
  const offer = pricing.resolveProductOffer("soap-a", verified(14900, { availability: "out-of-stock" }), [promotion()], NOW);
  assert.equal(offer.availability, "out-of-stock");
  assert.equal(offer.finalPrice, 14900);
  assert.equal(offer.promotionId, null);
});

test("coupons: unknown, inactive, not-started and expired codes are rejected", () => {
  const coupon = promotion({ id: "welcome", couponCode: "WELCOME" });
  assert.deepEqual(pricing.validateCoupon("nope", [coupon], NOW), { ok: false, reason: "unknown" });
  assert.deepEqual(pricing.validateCoupon("", [coupon], NOW), { ok: false, reason: "unknown" });
  assert.deepEqual(pricing.validateCoupon("welcome", [{ ...coupon, enabled: false }], NOW), { ok: false, reason: "inactive" });
  assert.deepEqual(pricing.validateCoupon("WELCOME", [coupon], Date.parse("2026-10-01T00:00:00Z")), { ok: false, reason: "not-started" });
  assert.deepEqual(pricing.validateCoupon("WELCOME", [coupon], Date.parse("2026-12-01T00:00:00Z")), { ok: false, reason: "expired" });
  assert.equal(pricing.validateCoupon(" welcome ", [coupon], NOW).ok, true);
});

test("coupon promotions require a valid code and never stack with automatic ones", () => {
  const automatic = promotion({ id: "auto", discount: { type: "percentage", percent: 10 } });
  const coupon = promotion({ id: "welcome", couponCode: "WELCOME", discount: { type: "percentage", percent: 12 } });
  assert.equal(pricing.resolveProductOffer("soap-a", verified(10000), [automatic, coupon], NOW).promotionId, "auto");
  const withCode = pricing.resolveProductOffer("soap-a", verified(10000), [automatic, coupon], NOW, "WELCOME");
  assert.equal(withCode.promotionId, "welcome");
  assert.equal(withCode.finalPrice, 8800); // 12% only, not 10% + 12%
  const expiredCode = pricing.resolveProductOffer("soap-a", verified(10000), [automatic, coupon], Date.parse("2026-11-20T00:00:00Z"), "WELCOME");
  assert.equal(expiredCode.promotionId, null);
});

test("bundle savings come from verified prices and approved bundle price", () => {
  const listed = new Set(["soap-a", "soap-b"]);
  const prices = { "soap-a": verified(15000), "soap-b": verified(12500) };
  const bundle = { id: "b", name: "B", description: "", items: [{ productId: "soap-a", quantity: 2 }, { productId: "soap-b", quantity: 1 }], status: "approved", bundlePrice: 39000, blockers: [] };
  const offer = pricing.resolveBundleOffer(bundle, prices, listed);
  assert.equal(offer.kind, "priced");
  assert.equal(offer.referenceTotal, 42500);
  assert.equal(offer.savings, 3500);
  assert.equal(offer.discountPercent, 8);
  assert.equal(pricing.resolveBundleOffer({ ...bundle, bundlePrice: 30000 }, prices, listed).kind, "preview"); // > 15%
  assert.equal(pricing.resolveBundleOffer({ ...bundle, bundlePrice: 42500 }, prices, listed).kind, "preview"); // no saving
  assert.equal(pricing.resolveBundleOffer({ ...bundle, status: "proposed" }, prices, listed).kind, "preview");
  assert.equal(pricing.resolveBundleOffer(bundle, { "soap-a": prices["soap-a"] }, listed).kind, "preview");
  assert.equal(pricing.resolveBundleOffer(bundle, { ...prices, "soap-b": verified(12500, { availability: "out-of-stock" }) }, listed).availability, "out-of-stock");
});

test("bundles with unlisted, duplicate or invalid-quantity items are ineligible", () => {
  const listed = new Set(["soap-a"]);
  const base = { id: "b", name: "B", description: "", status: "approved", bundlePrice: 100, blockers: [] };
  assert.equal(pricing.resolveBundleOffer({ ...base, items: [{ productId: "coconut-oil", quantity: 1 }] }, {}, listed).kind, "ineligible");
  assert.equal(pricing.resolveBundleOffer({ ...base, items: [{ productId: "soap-a", quantity: 0 }] }, {}, listed).kind, "ineligible");
  assert.equal(pricing.resolveBundleOffer({ ...base, items: [{ productId: "soap-a", quantity: 1.5 }] }, {}, listed).kind, "ineligible");
  assert.equal(pricing.resolveBundleOffer({ ...base, items: [{ productId: "soap-a", quantity: 1 }, { productId: "soap-a", quantity: 1 }] }, {}, listed).kind, "ineligible");
});

const fixtureProducts = [
  view("soap-a", "Charcoal Soap", priced(13100, { originalPrice: 14900, savings: 1800, discountPercent: 12 })),
  view("soap-b", "Manjistha Soap", priced(9900)),
  view("malt", "ABC Malt", priced(25000, { originalPrice: 29000, savings: 4000, discountPercent: 13 }), "traditional-mixes"),
  view("honey", "Honey", { kind: "unpriced", reason: "pending" }, "pantry-essentials"),
  view("ghee", "Desi Ghee", priced(45000, { availability: "out-of-stock", originalPrice: 50000, savings: 5000, discountPercent: 10 }), "pantry-essentials"),
];
const ids = (products) => products.map((product) => product.id);

test("search matches product names case-insensitively and reports empty results", () => {
  assert.deepEqual(ids(filterSaleProducts(fixtureProducts, { ...defaultSaleFilters, query: "  soap " })), ["soap-a", "soap-b"]);
  assert.deepEqual(ids(filterSaleProducts(fixtureProducts, { ...defaultSaleFilters, query: "MALT" })), ["malt"]);
  assert.deepEqual(filterSaleProducts(fixtureProducts, { ...defaultSaleFilters, query: "turmeric" }), []);
});

test("collection, price, discount and availability filters combine", () => {
  assert.deepEqual(ids(filterSaleProducts(fixtureProducts, { ...defaultSaleFilters, collection: "pantry-essentials" })), ["honey", "ghee"]);
  assert.deepEqual(ids(filterSaleProducts(fixtureProducts, { ...defaultSaleFilters, minPrice: 100, maxPrice: 300 })), ["soap-a", "malt"]);
  assert.deepEqual(ids(filterSaleProducts(fixtureProducts, { ...defaultSaleFilters, minDiscount: 10 })), ["soap-a", "malt"]); // ghee is out of stock
  assert.deepEqual(ids(filterSaleProducts(fixtureProducts, { ...defaultSaleFilters, inStockOnly: true })), ["soap-a", "soap-b", "malt"]);
  assert.deepEqual(ids(filterSaleProducts(fixtureProducts, { ...defaultSaleFilters, collection: "herbal-soaps", minDiscount: 5, maxPrice: 200 })), ["soap-a"]);
});

test("price sorting is numeric, with unpriced products last", () => {
  assert.deepEqual(ids(filterSaleProducts(fixtureProducts, { ...defaultSaleFilters, sort: "price-asc" })), ["soap-b", "soap-a", "malt", "ghee", "honey"]);
  assert.deepEqual(ids(filterSaleProducts(fixtureProducts, { ...defaultSaleFilters, sort: "price-desc" })), ["ghee", "malt", "soap-a", "soap-b", "honey"]);
});

test("biggest savings sorts by rupee savings and ignores unavailable products", () => {
  assert.deepEqual(ids(filterSaleProducts(fixtureProducts, { ...defaultSaleFilters, sort: "savings-desc" })), ["malt", "soap-a", "soap-b", "honey", "ghee"]);
});

test("filtering never duplicates a product and discount options reflect live deals only", () => {
  const withDuplicate = [...fixtureProducts, fixtureProducts[0]];
  assert.equal(filterSaleProducts(withDuplicate, defaultSaleFilters).length, fixtureProducts.length);
  assert.deepEqual(getDiscountOptions(fixtureProducts), [5, 10]);
  assert.deepEqual(getDiscountOptions([fixtureProducts[3]]), []);
});

test("snapshot lists each catalogue product once, keeps missing images null and hides ineligible bundles", () => {
  const image = { src: "/a.webp", alt: "A", approvalStatus: "approved" };
  const product = (routeKey, extra = {}) => ({ routeKey, name: routeKey, status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "herbal-soaps", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: null, images: [], ...extra });
  const snapshot = buildSaleSnapshot({
    catalog: [product("soap-a", { images: [image] }), product("soap-b"), product("soap-a"), product("draft", { membershipStatus: "draft" })],
    pricing: { "soap-a": verified(14900) },
    provisionalPricing: {},
    pricingMode: "official",
    illustrativeBundlePercent: 15,
    promotions: [promotion()],
    bundles: [
      { id: "ok", name: "OK", description: "", items: [{ productId: "soap-a", quantity: 1 }, { productId: "soap-b", quantity: 1 }], status: "proposed", bundlePrice: null, blockers: [] },
      { id: "oils", name: "Oils", description: "", items: [{ productId: "coconut-oil", quantity: 1 }], status: "proposed", bundlePrice: null, blockers: [] },
    ],
    campaign: { id: "c", title: "C", approved: true, startsAt: "2026-11-01T00:00:00Z", endsAt: "2026-11-15T00:00:00Z" },
  }, NOW);
  assert.deepEqual(ids(snapshot.products), ["soap-a", "soap-b"]);
  assert.deepEqual(snapshot.products[0].image, { src: "/a.webp", alt: "A", focus: undefined });
  assert.equal(snapshot.products[1].image, null);
  assert.equal(snapshot.products[0].offer.finalPrice, 13100);
  assert.equal(snapshot.products[1].offer.kind, "unpriced");
  assert.deepEqual(snapshot.bundles.map((offer) => offer.bundle.id), ["ok"]);
  assert.equal(snapshot.bundles[0].kind, "preview");
  assert.equal(snapshot.campaignLive, true);
});

test("shipped configuration activates nothing until the owner approves it", () => {
  for (const promo of config.promotions) {
    assert.equal(pricing.isPromotionLive(promo, NOW), false, promo.id);
  }
  assert.equal(pricing.isCampaignLive(config.heritageSaleCampaign, config.promotions, NOW), false);
  for (const record of Object.values(config.productPricing)) assert.equal(record.status, "unverified");
  for (const id of ["honey", "instant-moringa-soup-mix"]) {
    assert.ok(config.promotions.every((promo) => promo.excludedProductIds.includes(id) || !promo.productIds.includes(id)), id);
  }
});

// ---- Catalogue, image registry and provisional preview pricing ----

const catalogIds = catalogPreviewProducts.map((product) => product.routeKey);
const publicPath = (src) => path.join(root, "public", ...src.split("/").filter(Boolean));
/** Exact-case existence check; Windows file systems ignore case, production hosts do not. */
const existsWithExactCase = (src) => {
  const file = publicPath(src);
  return fs.existsSync(file) && fs.readdirSync(path.dirname(file)).includes(path.basename(file));
};
// Must match docs/MISSING_PRODUCT_IMAGES.md.
const PRODUCTS_WITHOUT_PHOTOS = [];

test("catalogue has 16 products with unique stable ids and detail routes", () => {
  assert.equal(catalogIds.length, 16);
  assert.equal(new Set(catalogIds).size, 16);
  for (const id of catalogIds) {
    assert.match(id, /^[a-z0-9]+(-[a-z0-9]+)*$/, id);
    assert.ok(fs.existsSync(path.join(root, "app", "products", id, "page.tsx")), `route for ${id}`);
  }
});

test("every registered product image exists with exact filename case", () => {
  for (const [id, images] of Object.entries(productImages)) {
    assert.ok(catalogIds.includes(id), `registry key ${id} is a catalogue product`);
    assert.ok(images.length > 0, id);
    for (const image of images) {
      assert.ok(existsWithExactCase(image.src), `${id}: ${image.src}`);
      assert.ok(image.alt.trim().length > 10, `${id}: alt text`);
    }
    assert.notEqual(images[0].kind, "lifestyle", `${id}: card image is not a lifestyle shot`);
  }
});

test("no image is shared between products, and catalogue images come from the registry", () => {
  const owners = new Map();
  for (const [id, images] of Object.entries(productImages)) {
    for (const image of images) {
      assert.ok(!owners.has(image.src) || owners.get(image.src) === id, `${image.src} used by ${owners.get(image.src)} and ${id}`);
      owners.set(image.src, id);
    }
  }
  for (const product of catalogPreviewProducts) {
    assert.deepEqual(product.images.map((image) => image.src), (productImages[product.routeKey] ?? []).map((image) => image.src), product.routeKey);
  }
});

test("products without photos are exactly the documented missing-assets list", () => {
  const missing = catalogPreviewProducts.filter((product) => product.images.length === 0).map((product) => product.routeKey);
  assert.deepEqual([...missing].sort(), [...PRODUCTS_WITHOUT_PHOTOS].sort());
});

test("combo membership matches the proposed bundle definitions", () => {
  const members = Object.fromEntries(config.bundles.map((bundle) => [bundle.id, bundle.items.map((item) => item.productId)]));
  assert.deepEqual(members, {
    "herbal-soap-collection": ["charcoal-soap", "manjistha-soap", "kuppameni-soap", "nalangumavu-soap", "multani-mitti-soap"],
    "traditional-mix-trio": ["abc-malt", "beetroot-malt", "karuppu-kavuni-kanji-mix"],
    "heritage-pantry-set": ["honey", "gulkand", "desi-ghee", "asafoetida"],
    "botanical-essentials-set": ["coconut-oil", "herbal-pain-balm", "karpooravalli-thailam"],
    "herbal-skincare-combo": ["nalangumavu-soap", "manjistha-soap", "multani-mitti-soap"],
    "hair-and-bath-care-combo": ["coconut-oil", "nalangumavu-soap", "multani-mitti-soap"],
    "traditional-nutrition-combo": ["abc-malt", "karuppu-kavuni-kanji-mix", "honey"],
    "daily-wellness-combo": ["instant-moringa-soup-mix", "honey", "gulkand"],
    "herbal-essentials-combo": ["charcoal-soap", "coconut-oil", "herbal-pain-balm", "honey"],
  });
  const signatures = Object.values(members).map((ids) => [...ids].sort().join());
  assert.equal(new Set(signatures).size, signatures.length, "no two combos contain the same products");
  for (const ids of Object.values(members)) for (const id of ids) assert.ok(catalogIds.includes(id), id);
});

const previewSources = (overrides = {}) => ({
  catalog: catalogPreviewProducts,
  pricing: config.productPricing,
  provisionalPricing,
  pricingMode: "development-preview",
  illustrativeBundlePercent: ILLUSTRATIVE_BUNDLE_DISCOUNT_PERCENT,
  illustrativeBundlePercents,
  promotions: config.promotions,
  bundles: config.bundles,
  campaign: config.heritageSaleCampaign,
  ...overrides,
});

test("illustrative combo totals are derived from the provisional dataset", () => {
  const snapshot = buildSaleSnapshot(previewSources(), NOW);
  const totals = Object.fromEntries(snapshot.bundles.map((offer) => [offer.bundle.id, offer.kind === "illustrative" ? [offer.referenceTotal / 100, offer.bundlePrice / 100, offer.savings / 100, offer.discountPercent] : offer.kind]));
  assert.deepEqual(totals, {
    "herbal-soap-collection": [685, 589, 96, 14],
    // 98 / 757 = 12.95%; percentages are floored so a saving is never overstated.
    "traditional-mix-trio": [757, 659, 98, 12],
    "heritage-pantry-set": [726, 624, 102, 14],
    "botanical-essentials-set": [427, 363, 64, 14],
    "herbal-skincare-combo": [407, 354, 53, 13],
    "hair-and-bath-care-combo": [437, 380, 57, 13],
    "traditional-nutrition-combo": [707, 608, 99, 14],
    "daily-wellness-combo": [527, 458, 69, 13],
    "herbal-essentials-combo": [626, 538, 88, 14],
  });
  for (const offer of snapshot.bundles) assert.equal(offer.savings, offer.referenceTotal - offer.bundlePrice, offer.bundle.id);
});

test("shipped illustrative combos stay within the 15% ceiling and vary", () => {
  const offers = buildSaleSnapshot(previewSources(), NOW).bundles;
  for (const offer of offers) {
    assert.equal(offer.kind, "illustrative", offer.bundle.id);
    assert.ok(offer.savings / offer.referenceTotal <= 0.15, offer.bundle.id);
    assert.ok(offer.savings / offer.referenceTotal >= 0.1, offer.bundle.id);
  }
  assert.ok(new Set(offers.map((offer) => offer.discountPercent)).size > 1);
});

const searchIndex = () => buildSearchIndex(buildSaleSnapshot(previewSources(), NOW).products, {
  collections: require("../content/catalog-preview.ts").previewCollections,
  descriptions: comboItemNotes,
  collectionKeywords: collectionSearchKeywords,
  productKeywords: productSearchKeywords,
});
const found = (query) => searchProducts(searchIndex(), query).map((product) => product.id);

test("search covers the whole catalogue with name, image, description and price", () => {
  const index = searchIndex();
  assert.equal(index.length, catalogPreviewProducts.length);
  for (const product of index) {
    assert.ok(product.name && product.href.startsWith("/products/") && product.category && product.description && product.image, product.id);
    assert.equal(product.offer.kind, "provisional", product.id);
  }
});

test("search matches names, categories, descriptions and keywords", () => {
  assert.deepEqual(found("Charcoal Soap"), ["charcoal-soap"]);
  assert.deepEqual(found("  CHARCOAL   soap "), ["charcoal-soap"]);
  assert.deepEqual(found("coal"), ["charcoal-soap"]);
  assert.equal(found("soap").length, 5);
  assert.equal(found("Oils & Balms").length, 3);
  assert.deepEqual(found("fuller"), ["multani-mitti-soap"]);
  assert.deepEqual(found("hing"), ["asafoetida"]);
  assert.deepEqual(found("hair"), ["coconut-oil"]);
  assert.ok(found("skin care").includes("kuppameni-soap"));
});

test("search ranks the best name match first and requires every word", () => {
  assert.equal(found("honey")[0], "honey");
  assert.equal(found("ABC Malt")[0], "abc-malt");
  assert.equal(found("malt")[0], "abc-malt");
  assert.deepEqual(found("soap for charcoal"), ["charcoal-soap"]);
  assert.deepEqual(found("hair growth"), []);
  assert.deepEqual(found("radiant glow"), []);
  assert.deepEqual(found("zzzz"), []);
  assert.deepEqual(found("   "), []);
  assert.deepEqual(found("!!!"), []);
});

test("search treats regular-expression characters as plain text", () => {
  assert.deepEqual(found("(.*"), []);
  assert.deepEqual(highlightMatches("Honey", "(.*"), [{ text: "Honey", match: false }]);
});

test("search highlights matching words and keeps the text intact", () => {
  assert.deepEqual(highlightMatches("Charcoal Soap", "soap charcoal"), [{ text: "Charcoal", match: true }, { text: " ", match: false }, { text: "Soap", match: true }]);
  assert.deepEqual(highlightMatches("Charcoal Soap", "coal"), [{ text: "Char", match: false }, { text: "coal", match: true }, { text: " Soap", match: false }]);
  assert.deepEqual(highlightMatches("Abc", "b"), [{ text: "Abc", match: false }]);
});

test("every search suggestion returns a product", () => {
  for (const suggestion of searchSuggestions) assert.ok(found(suggestion).length > 0, suggestion);
});

const { concerns, concernGroups, getConcern } = require("../content/concerns.ts");
const { buildCartPrices, getCartTotal } = require("./cart-pricing.ts");
const CLAIM_WORDS = /cure|heal|treat|prevent|remed|reduce|stop|boost|clinically/i;

test("every concern uses real catalogue products and avoids treatment claims", () => {
  const ids = catalogPreviewProducts.map((product) => product.routeKey);
  assert.equal(concerns.length, 8);
  assert.equal(new Set(concerns.map((concern) => concern.slug)).size, 8);
  for (const concern of concerns) {
    assert.ok(concern.productIds.length > 0, concern.slug);
    for (const id of concern.productIds) assert.ok(ids.includes(id), id);
    assert.doesNotMatch(concern.intro, CLAIM_WORDS, concern.slug);
    assert.equal(getConcern(concern.slug), concern);
  }
  assert.equal(getConcern("missing"), undefined);
});

test("concern groups link every concern exactly once and their images exist", () => {
  const grouped = concernGroups.flatMap((group) => group.concernSlugs);
  assert.deepEqual([...grouped].sort(), concerns.map((concern) => concern.slug).sort());
  for (const group of concernGroups) {
    assert.ok(fs.existsSync(path.join(root, "public", group.image.src)), group.image.src);
    assert.doesNotMatch(group.description, CLAIM_WORDS, group.id);
  }
});

const withFeatured = (overrides = {}, now = NOW) => buildSaleSnapshot(previewSources({ featuredCombo: { ...config.featuredCombo, ...overrides } }), now);

test("featured combo is one valid, unique combo within the discount ceiling", () => {
  const { bundle, hotspots, betterTogether, composition, previewDiscountPercent } = config.featuredCombo;
  const ids = catalogPreviewProducts.map((product) => product.routeKey);
  const members = bundle.items.map((item) => item.productId);
  for (const id of [...members, ...betterTogether]) assert.ok(ids.includes(id), id);
  for (const id of betterTogether) assert.ok(!members.includes(id), id + " is already in the combo");
  for (const [id, spot] of Object.entries(hotspots)) {
    assert.ok(members.includes(id), id);
    assert.ok(spot.x >= 0 && spot.x <= 100 && spot.y >= 0 && spot.y <= 100, id);
  }
  assert.ok(fs.existsSync(path.join(root, "public", composition.src)));
  assert.ok(previewDiscountPercent > 0 && previewDiscountPercent <= 15);
  const signature = [...members].sort().join();
  for (const other of config.bundles) assert.notEqual(other.items.map((item) => item.productId).sort().join(), signature, other.id);
  assert.ok(!config.bundles.some((other) => other.id === bundle.id), "not listed in the combo carousel");
  assert.ok(Number.isFinite(Date.parse(config.featuredCombo.endsAt)));
});

test("featured combo totals come from catalogue prices", () => {
  const featured = withFeatured({ endsAt: "2030-01-01T00:00:00+05:30" }).featuredCombo;
  assert.equal(featured.state, "live");
  assert.equal(featured.isEstimate, true);
  assert.deepEqual(featured.pricing, { referenceTotal: 63600, bundlePrice: 55300, savings: 8300, discountPercent: 13 });
  assert.ok(featured.pricing.savings / featured.pricing.referenceTotal <= 0.15);
});

test("featured combo ends exactly at its deadline, and bad dates never stay open", () => {
  const endsAt = "2026-11-30T23:59:59+05:30";
  const end = Date.parse(endsAt);
  assert.equal(withFeatured({ endsAt }, end - 1).featuredCombo.state, "live");
  assert.equal(withFeatured({ endsAt }, end).featuredCombo.state, "expired");
  assert.equal(withFeatured({ endsAt: "not a date" }).featuredCombo.state, "expired");
});

test("featured combo shows no offer or countdown state in official mode without approval", () => {
  const featured = buildSaleSnapshot(previewSources({ pricingMode: "official", featuredCombo: { ...config.featuredCombo, endsAt: "2030-01-01T00:00:00+05:30" } }), NOW).featuredCombo;
  assert.deepEqual(featured, { id: config.featuredCombo.bundle.id, state: "unpriced", isEstimate: false, pricing: null });
});

test("cart prices cover products and combos, and an ended offer loses its discount", () => {
  const live = buildCartPrices(withFeatured({ endsAt: "2030-01-01T00:00:00+05:30" }));
  assert.equal(live.isEstimate, true);
  assert.equal(live.prices["charcoal-soap"], 14900);
  assert.equal(live.prices["bundle:herbal-soap-collection"], 58900);
  assert.equal(live.prices["bundle:new-arrival-herbal-combo"], 55300);
  const ended = buildCartPrices(withFeatured({ endsAt: "2020-01-01T00:00:00+05:30" }));
  assert.equal(ended.prices["bundle:new-arrival-herbal-combo"], 63600);
  const official = buildCartPrices(buildSaleSnapshot(previewSources({ pricingMode: "official" }), NOW));
  assert.deepEqual(official, { prices: {}, isEstimate: false });
});

test("cart total multiplies quantities and never shows a partial total", () => {
  const prices = { a: 10000, b: 2500 };
  assert.equal(getCartTotal([], prices), 0);
  assert.equal(getCartTotal([{ id: "a", quantity: 2 }, { id: "b", quantity: 1 }], prices), 22500);
  assert.equal(getCartTotal([{ id: "a", quantity: 1 }, { id: "c", quantity: 1 }], prices), null);
});

test("every catalogue product has a combo popup note with no benefit claims", () => {
  for (const product of catalogPreviewProducts) {
    const note = comboItemNotes[product.routeKey];
    assert.ok(note, product.routeKey);
    assert.doesNotMatch(note, /cure|heal|relie|treat|boost|immun|glow|growth/i, product.routeKey);
  }
});

test("changing a provisional price changes the combo total (no hardcoded totals)", () => {
  const cheaperSoap = { ...provisionalPricing, "charcoal-soap": { status: "provisional", packSize: "100 g", sellingPrice: 10000 } };
  const offer = buildSaleSnapshot(previewSources({ provisionalPricing: cheaperSoap }), NOW).bundles.find((bundle) => bundle.bundle.id === "herbal-soap-collection");
  assert.equal(offer.referenceTotal, 63600);
  assert.equal(offer.bundlePrice, 54700); // 636 x 0.86 = 546.96 -> 547
});

test("official mode shows no provisional prices or illustrative combos", () => {
  const snapshot = buildSaleSnapshot(previewSources({ pricingMode: "official" }), NOW);
  assert.ok(snapshot.products.every((product) => product.offer.kind === "unpriced"));
  assert.ok(snapshot.bundles.every((offer) => offer.kind === "preview"));
});

test("preview mode prices every product provisionally, with no discount or MRP", () => {
  const snapshot = buildSaleSnapshot(previewSources(), NOW);
  assert.equal(snapshot.products.length, 16);
  for (const product of snapshot.products) {
    assert.equal(product.offer.kind, "provisional", product.id);
    assert.deepEqual(Object.keys(product.offer).sort(), ["kind", "packSize", "price"]);
  }
  assert.equal(snapshot.products.find((product) => product.id === "honey").offer.price, 19900);
});

test("verified official prices are never overwritten by provisional estimates", () => {
  const official = { "charcoal-soap": verified(15900), honey: { status: "unverified", reason: "pending" } };
  const merged = pricing.mergePricing(official, provisionalPricing, "development-preview");
  assert.deepEqual(merged["charcoal-soap"], official["charcoal-soap"]);
  assert.equal(merged.honey.status, "provisional");
  assert.deepEqual(pricing.mergePricing(official, provisionalPricing, "official"), official);
  assert.ok(Object.values(config.productPricing).every((record) => record.status !== "provisional"));
});

test("provisional and illustrative prices can never activate purchase actions", () => {
  const snapshot = buildSaleSnapshot(previewSources(), NOW);
  for (const offer of [...snapshot.products.map((product) => product.offer), ...snapshot.bundles]) {
    assert.equal(pricing.isPurchasable(offer, true), false);
    assert.equal(pricing.isPurchasable(offer, false), false);
  }
  const verifiedOffer = pricing.resolveProductOffer("soap-a", verified(14900), [], NOW);
  assert.equal(pricing.isPurchasable(verifiedOffer, false), false);
  assert.equal(pricing.isPurchasable(verifiedOffer, true), true);
  assert.equal(config.checkoutConnected, false);
  // Promotions never apply to estimates.
  assert.equal(pricing.resolveProductOffer("soap-a", { status: "provisional", packSize: "100 g", sellingPrice: 14900 }, [promotion()], NOW).kind, "provisional");
});

test("provisional prices take part in price filters and sorting, not discount filters", () => {
  const products = buildSaleSnapshot(previewSources(), NOW).products;
  const cheap = filterSaleProducts(products, { ...defaultSaleFilters, maxPrice: 100 }).map((product) => product.id);
  assert.deepEqual(cheap.sort(), ["asafoetida", "herbal-pain-balm"]);
  assert.equal(filterSaleProducts(products, { ...defaultSaleFilters, sort: "price-desc" })[0].id, "abc-malt");
  assert.deepEqual(getDiscountOptions(products), []);
  assert.equal(filterSaleProducts(products, { ...defaultSaleFilters, minDiscount: 5 }).length, 0);
});

// ---- Campaign states ----

test("campaign state moves preview → upcoming → active → ended at its configured boundaries", () => {
  const campaign = { id: "c", title: "C", approved: true, startsAt: "2026-11-01T00:00:00Z", endsAt: "2026-11-15T00:00:00Z" };
  const live = [promotion()];
  assert.equal(pricing.getCampaignState(campaign, live, Date.parse("2026-10-31T23:59:59Z")), "upcoming");
  assert.equal(pricing.getCampaignState(campaign, live, Date.parse("2026-11-01T00:00:00Z")), "active");
  assert.equal(pricing.getCampaignState(campaign, live, Date.parse("2026-11-14T23:59:59Z")), "active");
  assert.equal(pricing.getCampaignState(campaign, live, Date.parse("2026-11-15T00:00:00Z")), "ended");
  assert.equal(pricing.isCampaignLive(campaign, live, Date.parse("2026-11-15T00:00:00Z")), false);
});

test("unapproved, undated or offer-less campaigns stay in preview", () => {
  const campaign = { id: "c", title: "C", approved: true, startsAt: "2026-11-01T00:00:00Z", endsAt: "2026-11-15T00:00:00Z" };
  assert.equal(pricing.getCampaignState({ ...campaign, approved: false }, [promotion()], NOW), "preview");
  assert.equal(pricing.getCampaignState({ ...campaign, endsAt: null }, [promotion()], NOW), "preview");
  assert.equal(pricing.getCampaignState({ ...campaign, endsAt: campaign.startsAt }, [promotion()], NOW), "preview");
  // Inside its window but with no live promotion, nothing is on offer.
  assert.equal(pricing.getCampaignState(campaign, [promotion({ enabled: false })], NOW), "preview");
});

test("shipped campaign is in preview and its spotlight product exists", () => {
  assert.equal(pricing.getCampaignState(config.heritageSaleCampaign, config.promotions, NOW), "preview");
  assert.ok(catalogIds.includes(config.heritageSaleCampaign.featuredProductId), config.heritageSaleCampaign.featuredProductId);
});
