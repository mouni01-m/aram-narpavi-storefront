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

const { cartReducer, getCartItemCount, initialCartState, isPositiveInteger, resolvePreviewCartProduct } = require("./cart-state.ts");

const eligiblePreviews = [
  { routeKey: "charcoal-soap", name: "Charcoal Soap", detailPageStatus: "development-preview-eligible", images: [] },
  { routeKey: "excluded-item", name: "Excluded Item", detailPageStatus: "blocked", images: [] },
];

test("resolves only explicitly eligible preview products", () => {
  assert.deepEqual(resolvePreviewCartProduct("charcoal-soap", eligiblePreviews), {
    id: "charcoal-soap",
    name: "Charcoal Soap",
    href: "/products/charcoal-soap",
    image: null,
  });
  assert.equal(resolvePreviewCartProduct("excluded-item", eligiblePreviews), null);
  assert.equal(resolvePreviewCartProduct("unknown", eligiblePreviews), null);
});

test("adds an eligible item and merges duplicate additions", () => {
  const product = resolvePreviewCartProduct("charcoal-soap", eligiblePreviews);
  const once = cartReducer(initialCartState, { type: "add", product });
  const twice = cartReducer(once, { type: "add", product });
  assert.equal(twice.items.length, 1);
  assert.equal(twice.items[0]?.quantity, 2);
  assert.equal(getCartItemCount(twice), 2);
});

test("rejects unresolved additions", () => {
  const state = cartReducer(initialCartState, { type: "add", product: null });
  assert.strictEqual(state, initialCartState);
});

test("increases and decreases quantity while preserving the minimum of one", () => {
  const product = resolvePreviewCartProduct("charcoal-soap", eligiblePreviews);
  const added = cartReducer(initialCartState, { type: "add", product });
  const increased = cartReducer(added, { type: "increase", productId: "charcoal-soap" });
  assert.equal(increased.items[0]?.quantity, 2);
  const decreased = cartReducer(increased, { type: "decrease", productId: "charcoal-soap" });
  assert.equal(decreased.items[0]?.quantity, 1);
  const stillOne = cartReducer(decreased, { type: "decrease", productId: "charcoal-soap" });
  assert.equal(stillOne.items[0]?.quantity, 1);
});

test("removes an item and clears all items", () => {
  const product = resolvePreviewCartProduct("charcoal-soap", eligiblePreviews);
  const added = cartReducer(initialCartState, { type: "add", product });
  assert.deepEqual(cartReducer(added, { type: "remove", productId: "charcoal-soap" }), initialCartState);
  assert.deepEqual(cartReducer(added, { type: "clear" }), initialCartState);
});

test("validates positive integer quantities and excludes invalid values from the count", () => {
  assert.equal(isPositiveInteger(1), true);
  assert.equal(isPositiveInteger(0), false);
  assert.equal(isPositiveInteger(-1), false);
  assert.equal(isPositiveInteger(1.5), false);
  assert.equal(getCartItemCount({ items: [{ id: "bad", name: "Bad", href: "/products/bad", image: null, quantity: 0 }] }), 0);
});

const { resolvePreviewCartBundle, BUNDLE_HREF } = require("./cart-state.ts");

const bundlePreviews = [
  { routeKey: "charcoal-soap", name: "Charcoal Soap", detailPageStatus: "development-preview-eligible", images: [{ src: "/c.webp", alt: "Charcoal", approvalStatus: "approved" }] },
  { routeKey: "manjistha-soap", name: "Manjistha Soap", detailPageStatus: "development-preview-eligible", images: [] },
  { routeKey: "blocked-soap", name: "Blocked Soap", detailPageStatus: "blocked", images: [] },
];
const soapBundles = [
  { id: "soap-duo", name: "Soap Duo", items: [{ productId: "charcoal-soap", quantity: 1 }, { productId: "manjistha-soap", quantity: 2 }] },
  { id: "with-blocked", name: "Blocked Set", items: [{ productId: "charcoal-soap", quantity: 1 }, { productId: "blocked-soap", quantity: 1 }] },
  { id: "empty", name: "Empty", items: [] },
];

test("resolves a combo into one cart line listing its products", () => {
  assert.deepEqual(resolvePreviewCartBundle("soap-duo", soapBundles, bundlePreviews), {
    id: "bundle:soap-duo",
    name: "Soap Duo",
    href: BUNDLE_HREF,
    image: { src: "/c.webp", alt: "Charcoal" },
    includes: [{ name: "Charcoal Soap", quantity: 1 }, { name: "Manjistha Soap", quantity: 2 }],
  });
});

test("rejects unknown, empty and combos containing ineligible products", () => {
  assert.equal(resolvePreviewCartBundle("missing", soapBundles, bundlePreviews), null);
  assert.equal(resolvePreviewCartBundle("empty", soapBundles, bundlePreviews), null);
  assert.equal(resolvePreviewCartBundle("with-blocked", soapBundles, bundlePreviews), null);
});

test("adding the same combo twice merges into one line, separate from its products", () => {
  const bundle = resolvePreviewCartBundle("soap-duo", soapBundles, bundlePreviews);
  const product = resolvePreviewCartProduct("charcoal-soap", bundlePreviews);
  let state = cartReducer(initialCartState, { type: "add", product: bundle });
  state = cartReducer(state, { type: "add", product: bundle });
  state = cartReducer(state, { type: "add", product });
  assert.equal(state.items.length, 2);
  assert.equal(state.items.find((item) => item.id === "bundle:soap-duo").quantity, 2);
  assert.equal(getCartItemCount(state), 3);
});

test("rejects forged combo lines", () => {
  const bundle = resolvePreviewCartBundle("soap-duo", soapBundles, bundlePreviews);
  for (const forged of [
    { ...bundle, href: "/products/bundle:soap-duo" },
    { ...bundle, includes: [] },
    { ...bundle, includes: [{ name: "X", quantity: 0 }] },
    { ...bundle, id: "soap-duo" },
  ]) {
    assert.strictEqual(cartReducer(initialCartState, { type: "add", product: forged }), initialCartState);
  }
  const product = resolvePreviewCartProduct("charcoal-soap", bundlePreviews);
  assert.strictEqual(cartReducer(initialCartState, { type: "add", product: { ...product, includes: [{ name: "X", quantity: 1 }] } }), initialCartState);
});

test("every shipped combo resolves against the real catalogue", () => {
  const Module = require("node:module");
  const path = require("node:path");
  const root = path.resolve(__dirname, "../..");
  const resolveFilename = Module._resolveFilename;
  Module._resolveFilename = function resolveAlias(request, ...rest) {
    return resolveFilename.call(this, request.startsWith("@/") ? path.join(root, request.slice(2)) : request, ...rest);
  };
  const { bundles } = require("../commerce/sale-config.ts");
  const { catalogPreviewProducts } = require("../content/catalog-preview.ts");
  for (const bundle of bundles) {
    const line = resolvePreviewCartBundle(bundle.id, bundles, catalogPreviewProducts);
    assert.ok(line, bundle.id);
    assert.equal(line.includes.length, bundle.items.length);
  }
});
