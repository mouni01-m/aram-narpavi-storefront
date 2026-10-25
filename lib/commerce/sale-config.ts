import type { BundleDefinition, Campaign, ProductPricing, Promotion } from "./pricing";

/**
 * Single source of truth for sale pricing, promotions and bundles until Shopify is
 * connected. Nothing here is active: no product has a verified price, and every
 * promotion is disabled, unapproved and undated. Fill these records only with
 * owner-approved values; see docs/SALE_EXPERIENCE.md.
 */

/** True only once a real Shopify cart and hosted checkout are integrated. */
export const checkoutConnected = false;

const awaitingPrice: ProductPricing = { status: "unverified", reason: "Verified price, pack size and stock have not been supplied." };

export const productPricing: Readonly<Record<string, ProductPricing>> = {
  "charcoal-soap": awaitingPrice,
  "manjistha-soap": awaitingPrice,
  "kuppameni-soap": awaitingPrice,
  "nalangumavu-soap": awaitingPrice,
  "multani-mitti-soap": awaitingPrice,
  "abc-malt": awaitingPrice,
  "beetroot-malt": awaitingPrice,
  "karuppu-kavuni-kanji-mix": awaitingPrice,
  "instant-moringa-soup-mix": { status: "unverified", reason: "Recorded selling price (₹169) is above the recorded MRP (₹159); correction needed." },
  honey: { status: "unverified", reason: "Conflicting recorded prices (₹189 and ₹199); correction needed." },
  gulkand: awaitingPrice,
  asafoetida: awaitingPrice,
  "desi-ghee": awaitingPrice,
  "coconut-oil": awaitingPrice,
  "herbal-pain-balm": awaitingPrice,
  "karpooravalli-thailam": awaitingPrice,
};

export const heritageSaleCampaign: Campaign = {
  id: "heritage-sale",
  title: "The Heritage Sale",
  approved: false,
  startsAt: null,
  endsAt: null,
  // Merchandising choice for the campaign spotlight; change freely.
  featuredProductId: "karuppu-kavuni-kanji-mix",
};

export const promotions: readonly Promotion[] = [
  {
    id: "heritage-sale-individual",
    enabled: false,
    approved: false,
    title: "Heritage Sale: selected essentials",
    customerCopy: "Special savings on selected essentials.",
    discount: { type: "percentage", percent: 12 },
    productIds: [],
    bundleIds: [],
    excludedProductIds: ["honey", "instant-moringa-soup-mix"],
    startsAt: null,
    endsAt: null,
    couponCode: null,
    minimumQuantity: null,
    minimumOrderValue: null,
    stacking: "exclusive",
  },
  {
    id: "welcome-coupon",
    enabled: false,
    approved: false,
    title: "Welcome offer",
    customerCopy: "A welcome saving on your first order.",
    discount: { type: "percentage", percent: 10 },
    productIds: [],
    bundleIds: [],
    excludedProductIds: [],
    startsAt: null,
    endsAt: null,
    couponCode: null,
    minimumQuantity: null,
    minimumOrderValue: null,
    stacking: "exclusive",
  },
];

const bundleBlocker = "Pack sizes, quantities, eligibility and pricing need owner approval.";

export const bundles: readonly BundleDefinition[] = [
  {
    id: "herbal-soap-collection",
    name: "The Herbal Soap Collection",
    description: "Five soaps from the Aram Narpavi range.",
    items: [
      { productId: "charcoal-soap", quantity: 1 },
      { productId: "manjistha-soap", quantity: 1 },
      { productId: "kuppameni-soap", quantity: 1 },
      { productId: "nalangumavu-soap", quantity: 1 },
      { productId: "multani-mitti-soap", quantity: 1 },
    ],
    status: "proposed",
    bundlePrice: null,
    blockers: [bundleBlocker],
  },
  {
    id: "traditional-mix-trio",
    name: "The Traditional Mix Trio",
    description: "Three traditional mixes in one set.",
    items: [
      { productId: "abc-malt", quantity: 1 },
      { productId: "beetroot-malt", quantity: 1 },
      { productId: "karuppu-kavuni-kanji-mix", quantity: 1 },
    ],
    status: "proposed",
    bundlePrice: null,
    blockers: [bundleBlocker],
  },
  {
    id: "heritage-pantry-set",
    name: "The Heritage Pantry Set",
    description: "Four pantry staples, together.",
    items: [
      { productId: "honey", quantity: 1 },
      { productId: "gulkand", quantity: 1 },
      { productId: "desi-ghee", quantity: 1 },
      { productId: "asafoetida", quantity: 1 },
    ],
    status: "proposed",
    bundlePrice: null,
    blockers: [bundleBlocker, "Honey pricing conflict must be resolved."],
  },
  {
    id: "botanical-essentials-set",
    name: "The Botanical Essentials Set",
    description: "Oils and balms from the range.",
    items: [
      { productId: "coconut-oil", quantity: 1 },
      { productId: "herbal-pain-balm", quantity: 1 },
      { productId: "karpooravalli-thailam", quantity: 1 },
    ],
    status: "proposed",
    bundlePrice: null,
    blockers: [bundleBlocker, "Intended use and permitted product claims need verification."],
  },
];
