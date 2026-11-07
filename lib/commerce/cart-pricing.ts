import { BUNDLE_ID_PREFIX, type CartItem } from "../cart/cart-state";
import type { Paise } from "./pricing";
import type { SaleSnapshot } from "./sale-catalog";
import { priceOf } from "./sale-filters";

export type CartPrices = {
  /** Keyed by cart line id. A missing id means that line has no displayable price. */
  prices: Record<string, Paise>;
  isEstimate: boolean;
};

export function buildCartPrices(snapshot: SaleSnapshot): CartPrices {
  const prices: Record<string, Paise> = {};
  for (const product of snapshot.products) {
    const price = priceOf(product);
    if (price !== null) prices[product.id] = price;
  }
  for (const offer of snapshot.bundles) {
    if (offer.kind !== "preview") prices[`${BUNDLE_ID_PREFIX}${offer.bundle.id}`] = offer.bundlePrice;
  }
  const featured = snapshot.featuredCombo;
  if (featured?.pricing) {
    // Once the offer ends, the set costs the same as buying its products separately.
    prices[`${BUNDLE_ID_PREFIX}${featured.id}`] = featured.state === "live" ? featured.pricing.bundlePrice : featured.pricing.referenceTotal;
  }
  return { prices, isEstimate: snapshot.pricingMode === "development-preview" };
}

/** The total, or null when any line has no price, so a partial total is never shown as complete. */
export function getCartTotal(items: readonly CartItem[], prices: Readonly<Record<string, Paise>>): Paise | null {
  let total = 0;
  for (const item of items) {
    const price = prices[item.id];
    if (price === undefined) return null;
    total += price * item.quantity;
  }
  return total;
}
