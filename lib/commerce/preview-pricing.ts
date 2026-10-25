import type { PricingMode, ProductPricing } from "./pricing";

/**
 * DEVELOPMENT-PREVIEW ESTIMATES ONLY. These are not official Aram Narpavi prices and
 * must never be used to charge a customer. Pack sizes are assumptions awaiting
 * confirmation. Official prices belong in `productPricing` (sale-config.ts) or Shopify,
 * and a verified official record always takes precedence over these estimates.
 */
const estimate = (rupees: number, packSize: string): ProductPricing => ({ status: "provisional", sellingPrice: rupees * 100, packSize });

export const provisionalPricing: Readonly<Record<string, ProductPricing>> = {
  "charcoal-soap": estimate(149, "100 g"),
  "manjistha-soap": estimate(149, "100 g"),
  "kuppameni-soap": estimate(129, "100 g"),
  "nalangumavu-soap": estimate(129, "100 g"),
  "multani-mitti-soap": estimate(129, "100 g"),
  "abc-malt": estimate(279, "250 g"),
  "beetroot-malt": estimate(249, "250 g"),
  "karuppu-kavuni-kanji-mix": estimate(229, "250 g"),
  "instant-moringa-soup-mix": estimate(149, "100 g"),
  honey: estimate(199, "250 g"),
  gulkand: estimate(179, "250 g"),
  asafoetida: estimate(99, "50 g"),
  "desi-ghee": estimate(249, "200 ml/g"),
  "coconut-oil": estimate(179, "200 ml"),
  "herbal-pain-balm": estimate(99, "25 g"),
  "karpooravalli-thailam": estimate(149, "100 ml"),
};

/** Illustrative combo discount used only with provisional prices. */
export const ILLUSTRATIVE_BUNDLE_DISCOUNT_PERCENT = 15;

/**
 * Preview estimates show unless STOREFRONT_PRICING_MODE=official. Set that in
 * production before launch so only verified prices can appear.
 */
export function getPricingMode(): PricingMode {
  return process.env.STOREFRONT_PRICING_MODE === "official" ? "official" : "development-preview";
}
