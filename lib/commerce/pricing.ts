/**
 * Pure pricing, promotion and bundle rules for the sale experience.
 *
 * Money is held in integer paise. These functions decide what the storefront may
 * display; they are not a payment authority. Once Shopify is connected, cart and
 * checkout prices must come from Shopify and its discount engine, never from values
 * a browser submits.
 */

export type Paise = number;

export type ProductPricing =
  | {
    status: "verified";
    variantId: string;
    packSize: string;
    sellingPrice: Paise;
    /** Printed MRP; shown only when verified and not below the selling price. */
    referencePrice: Paise | null;
    availability: "in-stock" | "out-of-stock";
  }
  | { status: "unverified"; reason: string }
  /** Development-preview estimate: display only, never purchasable, never an MRP. */
  | { status: "provisional"; packSize: string; sellingPrice: Paise };

export type PricingMode = "official" | "development-preview";

export type PromotionDiscount =
  | { type: "percentage"; percent: number }
  | { type: "fixed"; amount: Paise };

export type Promotion = {
  id: string;
  enabled: boolean;
  /** Owner sign-off. Enabled but unapproved promotions never apply. */
  approved: boolean;
  title: string;
  customerCopy: string;
  discount: PromotionDiscount;
  productIds: readonly string[];
  bundleIds: readonly string[];
  excludedProductIds: readonly string[];
  /** ISO timestamps. Both are required; open-ended offers are not supported. */
  startsAt: string | null;
  endsAt: string | null;
  couponCode: string | null;
  minimumQuantity: number | null;
  minimumOrderValue: Paise | null;
  /** Only exclusive promotions are supported: at most one discount applies per line. */
  stacking: "exclusive";
};

export type BundleDefinition = {
  id: string;
  name: string;
  description: string;
  items: readonly { productId: string; quantity: number }[];
  status: "proposed" | "approved";
  /** Approved bundle selling price; null until the owner confirms it. */
  bundlePrice: Paise | null;
  blockers: readonly string[];
};

/** Business ceiling recorded in docs/ENVIRONMENT_SETUP.md. */
export const MAX_DISCOUNT_PERCENT = 15;

export type ProductOffer =
  | { kind: "unpriced"; reason: string }
  | { kind: "provisional"; packSize: string; price: Paise }
  | {
    kind: "priced";
    packSize: string;
    availability: "in-stock" | "out-of-stock";
    finalPrice: Paise;
    /** Pre-promotion selling price, set only when a live promotion applies. */
    originalPrice: Paise | null;
    mrp: Paise | null;
    savings: Paise;
    discountPercent: number;
    promotionId: string | null;
  };

export type BundleOffer =
  | { kind: "ineligible"; bundle: BundleDefinition; reasons: readonly string[] }
  | { kind: "preview"; bundle: BundleDefinition; reasons: readonly string[] }
  | {
    /** Calculated from provisional prices for development preview; never purchasable. */
    kind: "illustrative";
    bundle: BundleDefinition;
    referenceTotal: Paise;
    bundlePrice: Paise;
    savings: Paise;
    discountPercent: number;
  }
  | {
    kind: "priced";
    bundle: BundleDefinition;
    referenceTotal: Paise;
    bundlePrice: Paise;
    savings: Paise;
    discountPercent: number;
    availability: "in-stock" | "out-of-stock";
  };

/** Rounding rule: discounted prices round half-up to the nearest whole rupee. */
export function roundToRupee(value: Paise): Paise {
  return Math.floor(value / 100 + 0.5) * 100;
}

/** Displayed percentages are floored so a saving is never overstated. */
export function discountPercentOf(reference: Paise, final: Paise): number {
  if (reference <= 0 || final >= reference) return 0;
  return Math.floor(((reference - final) / reference) * 100);
}

export function formatRupees(value: Paise): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: value % 100 ? 2 : 0 }).format(value / 100);
}

function isPaise(value: unknown): value is Paise {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

/** A pricing record is usable only when its numbers are internally consistent. */
export function getPricingProblem(pricing: ProductPricing): string | null {
  if (pricing.status === "unverified") return pricing.reason;
  if (pricing.status === "provisional") return "Price is a provisional development estimate.";
  if (!pricing.variantId || !pricing.packSize) return "Variant or pack size is missing.";
  if (!isPaise(pricing.sellingPrice)) return "Selling price is not a valid amount.";
  if (pricing.referencePrice !== null && (!isPaise(pricing.referencePrice) || pricing.referencePrice < pricing.sellingPrice)) {
    return "MRP is lower than the selling price.";
  }
  return null;
}

function parseTime(value: string | null): number | null {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

/** Live means enabled, approved, well-formed and within [startsAt, endsAt). */
export function isPromotionLive(promotion: Promotion, now: number): boolean {
  const start = parseTime(promotion.startsAt);
  const end = parseTime(promotion.endsAt);
  if (!promotion.enabled || !promotion.approved || start === null || end === null || start >= end) return false;
  if (promotion.discount.type === "percentage") {
    const { percent } = promotion.discount;
    if (!Number.isFinite(percent) || percent <= 0 || percent > MAX_DISCOUNT_PERCENT) return false;
  } else if (!isPaise(promotion.discount.amount)) {
    return false;
  }
  return now >= start && now < end;
}

export function applyDiscount(price: Paise, discount: PromotionDiscount): Paise {
  const discounted = discount.type === "percentage"
    ? roundToRupee(price - (price * discount.percent) / 100)
    : price - discount.amount;
  // A discount may never reach zero or exceed the percentage ceiling.
  const floor = price - Math.floor((price * MAX_DISCOUNT_PERCENT) / 100);
  return Math.max(discounted, floor, 1);
}

function appliesToProduct(promotion: Promotion, productId: string): boolean {
  return promotion.productIds.includes(productId) && !promotion.excludedProductIds.includes(productId);
}

export type CouponResult =
  | { ok: true; promotion: Promotion }
  | { ok: false; reason: "unknown" | "inactive" | "expired" | "not-started" };

export function validateCoupon(code: string, promotions: readonly Promotion[], now: number): CouponResult {
  const normalized = code.trim().toUpperCase();
  const promotion = normalized ? promotions.find((candidate) => candidate.couponCode?.toUpperCase() === normalized) : undefined;
  if (!promotion) return { ok: false, reason: "unknown" };
  if (isPromotionLive(promotion, now)) return { ok: true, promotion };
  const start = parseTime(promotion.startsAt);
  const end = parseTime(promotion.endsAt);
  if (promotion.enabled && promotion.approved && end !== null && now >= end) return { ok: false, reason: "expired" };
  if (promotion.enabled && promotion.approved && start !== null && now < start) return { ok: false, reason: "not-started" };
  return { ok: false, reason: "inactive" };
}

/**
 * Resolve the displayed offer for one product. Coupon promotions apply only when a
 * valid code is supplied; promotions never stack, so the single largest saving wins.
 */
export function resolveProductOffer(
  productId: string,
  pricing: ProductPricing | undefined,
  promotions: readonly Promotion[],
  now: number,
  couponCode: string | null = null,
): ProductOffer {
  if (!pricing) return { kind: "unpriced", reason: "No pricing record exists." };
  // Promotions never apply to estimates.
  if (pricing.status === "provisional") {
    return isPaise(pricing.sellingPrice) && pricing.packSize
      ? { kind: "provisional", packSize: pricing.packSize, price: pricing.sellingPrice }
      : { kind: "unpriced", reason: "Provisional price is invalid." };
  }
  const problem = getPricingProblem(pricing);
  if (problem || pricing.status !== "verified") return { kind: "unpriced", reason: problem ?? "Pricing is not verified." };

  const coupon = couponCode ? validateCoupon(couponCode, promotions, now) : null;
  const candidates = promotions.filter((promotion) => appliesToProduct(promotion, productId)
    && isPromotionLive(promotion, now)
    && (promotion.couponCode === null || (coupon?.ok === true && coupon.promotion.id === promotion.id))
    && (promotion.minimumQuantity === null || promotion.minimumQuantity <= 1)
    && (promotion.minimumOrderValue === null || promotion.minimumOrderValue <= pricing.sellingPrice));

  let best: { promotion: Promotion; price: Paise } | null = null;
  if (pricing.availability === "in-stock") {
    for (const promotion of candidates) {
      const price = applyDiscount(pricing.sellingPrice, promotion.discount);
      if (price < pricing.sellingPrice && (!best || price < best.price)) best = { promotion, price };
    }
  }

  const finalPrice = best?.price ?? pricing.sellingPrice;
  return {
    kind: "priced",
    packSize: pricing.packSize,
    availability: pricing.availability,
    finalPrice,
    originalPrice: best ? pricing.sellingPrice : null,
    mrp: pricing.referencePrice !== null && pricing.referencePrice > finalPrice ? pricing.referencePrice : null,
    savings: best ? pricing.sellingPrice - finalPrice : 0,
    discountPercent: best ? discountPercentOf(pricing.sellingPrice, finalPrice) : 0,
    promotionId: best?.promotion.id ?? null,
  };
}

/**
 * Bundle savings = verified reference total - approved bundle price, and
 * discount % = savings / reference total x 100 (floored).
 */
export function resolveBundleOffer(
  bundle: BundleDefinition,
  pricing: Readonly<Record<string, ProductPricing>>,
  listedProductIds: ReadonlySet<string>,
): BundleOffer {
  const unlisted = bundle.items.filter((item) => !listedProductIds.has(item.productId));
  const invalidQuantity = bundle.items.some((item) => !Number.isSafeInteger(item.quantity) || item.quantity < 1);
  const duplicate = new Set(bundle.items.map((item) => item.productId)).size !== bundle.items.length;
  if (!bundle.items.length || unlisted.length || invalidQuantity || duplicate) {
    return {
      kind: "ineligible",
      bundle,
      reasons: [
        ...unlisted.map((item) => `${item.productId} is not a listed product.`),
        ...(invalidQuantity ? ["Every item needs a whole-number quantity of at least one."] : []),
        ...(duplicate ? ["A product appears more than once."] : []),
        ...(!bundle.items.length ? ["The bundle has no items."] : []),
      ],
    };
  }

  const reasons: string[] = [...bundle.blockers];
  if (bundle.status !== "approved") reasons.push("Bundle has not been approved.");
  if (!isPaise(bundle.bundlePrice)) reasons.push("Bundle price has not been approved.");
  let referenceTotal = 0;
  let allInStock = true;
  for (const item of bundle.items) {
    const record = pricing[item.productId];
    const problem = record ? getPricingProblem(record) : "No pricing record exists.";
    if (problem || !record || record.status !== "verified") {
      reasons.push(`${item.productId}: ${problem ?? "Pricing is not verified."}`);
      continue;
    }
    referenceTotal += record.sellingPrice * item.quantity;
    if (record.availability !== "in-stock") allInStock = false;
  }
  if (reasons.length || !isPaise(bundle.bundlePrice)) return { kind: "preview", bundle, reasons };

  const savings = referenceTotal - bundle.bundlePrice;
  const discountPercent = discountPercentOf(referenceTotal, bundle.bundlePrice);
  if (savings <= 0) return { kind: "preview", bundle, reasons: ["Bundle price is not below the combined price."] };
  if (discountPercent > MAX_DISCOUNT_PERCENT) return { kind: "preview", bundle, reasons: [`Bundle discount exceeds ${MAX_DISCOUNT_PERCENT}%.`] };
  return { kind: "priced", bundle, referenceTotal, bundlePrice: bundle.bundlePrice, savings, discountPercent, availability: allInStock ? "in-stock" : "out-of-stock" };
}

export type Campaign = {
  id: string;
  title: string;
  approved: boolean;
  startsAt: string | null;
  endsAt: string | null;
  /** Product shown in the campaign spotlight; a merchandising choice, not a sales ranking. */
  featuredProductId?: string | null;
};

/**
 * preview: not approved or not fully dated (estimates only, no live offer);
 * upcoming / ended: approved and dated, but outside its window;
 * active: inside its window and backed by at least one live promotion.
 */
export type CampaignState = "preview" | "upcoming" | "active" | "ended";

export function getCampaignState(campaign: Campaign, promotions: readonly Promotion[], now: number): CampaignState {
  const start = parseTime(campaign.startsAt);
  const end = parseTime(campaign.endsAt);
  if (!campaign.approved || start === null || end === null || start >= end) return "preview";
  if (now < start) return "upcoming";
  if (now >= end) return "ended";
  return promotions.some((promotion) => isPromotionLive(promotion, now)) ? "active" : "preview";
}

/** A campaign is live only when approved, in its window, and backed by a live promotion. */
export function isCampaignLive(campaign: Campaign, promotions: readonly Promotion[], now: number): boolean {
  return getCampaignState(campaign, promotions, now) === "active";
}

/**
 * Combine official and provisional pricing. A verified official record always wins;
 * provisional estimates fill gaps only in development-preview mode.
 */
export function mergePricing(
  official: Readonly<Record<string, ProductPricing>>,
  provisional: Readonly<Record<string, ProductPricing>>,
  mode: PricingMode,
): Record<string, ProductPricing> {
  const merged: Record<string, ProductPricing> = { ...official };
  if (mode !== "development-preview") return merged;
  for (const [id, estimate] of Object.entries(provisional)) {
    if (estimate.status === "provisional" && official[id]?.status !== "verified") merged[id] = estimate;
  }
  return merged;
}

/**
 * Illustrative bundle pricing from provisional item prices:
 * bundle price = reference total x (1 - percent / 100), rounded to the nearest rupee.
 */
export function resolveIllustrativeBundle(
  bundle: BundleDefinition,
  pricing: Readonly<Record<string, ProductPricing>>,
  discountPercent: number,
): Extract<BundleOffer, { kind: "illustrative" }> | null {
  if (!Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent > MAX_DISCOUNT_PERCENT) return null;
  let referenceTotal = 0;
  for (const item of bundle.items) {
    const record = pricing[item.productId];
    if (!record || record.status === "unverified" || !isPaise(record.sellingPrice)) return null;
    referenceTotal += record.sellingPrice * item.quantity;
  }
  const bundlePrice = roundToRupee(referenceTotal * (1 - discountPercent / 100));
  const savings = referenceTotal - bundlePrice;
  if (savings <= 0) return null;
  return { kind: "illustrative", bundle, referenceTotal, bundlePrice, savings, discountPercent: discountPercentOf(referenceTotal, bundlePrice) };
}

/** The only gate for real purchase actions: verified, in stock, and checkout connected. */
export function isPurchasable(offer: ProductOffer | BundleOffer, checkoutConnected: boolean): boolean {
  return checkoutConnected && offer.kind === "priced" && offer.availability === "in-stock";
}
