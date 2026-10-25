import "server-only";

import { connection } from "next/server";
import { cache } from "react";
import { catalogPreviewProducts } from "@/lib/content/catalog-preview";
import { buildSaleSnapshot } from "@/lib/commerce/sale-catalog";
import { bundles, heritageSaleCampaign, productPricing, promotions } from "@/lib/commerce/sale-config";
import { getPricingMode, ILLUSTRATIVE_BUNDLE_DISCOUNT_PERCENT, provisionalPricing } from "@/lib/commerce/preview-pricing";

/**
 * Offers are resolved per request on the server so a promotion stops being shown the
 * moment its window closes, without relying on a browser clock.
 */
export const getSaleSnapshot = cache(async () => {
  await connection();
  return buildSaleSnapshot({
    catalog: catalogPreviewProducts,
    pricing: productPricing,
    provisionalPricing,
    pricingMode: getPricingMode(),
    illustrativeBundlePercent: ILLUSTRATIVE_BUNDLE_DISCOUNT_PERCENT,
    promotions,
    bundles,
    campaign: heritageSaleCampaign,
  }, Date.now());
});
