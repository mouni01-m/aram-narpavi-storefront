import type { PreviewProduct } from "../content/catalog-preview";
import { getCampaignState, mergePricing, resolveBundleOffer, resolveIllustrativeBundle, resolveProductOffer, type BundleDefinition, type BundleOffer, type Campaign, type CampaignState, type FeaturedComboConfig, type Paise, type PricingMode, type ProductPricing, type Promotion } from "./pricing";
import type { SaleProductView } from "./sale-filters";

export type SaleSnapshot = {
  campaignLive: boolean;
  campaignState: CampaignState;
  pricingMode: PricingMode;
  products: SaleProductView[];
  /** Bundles that may be shown: priced, illustrative (preview estimates) or labelled previews. */
  bundles: Exclude<BundleOffer, { kind: "ineligible" }>[];
  featuredCombo?: FeaturedComboView | null;
};

export type FeaturedComboView = {
  id: string;
  /** unpriced: no approved or preview price, so no offer or countdown may be shown. */
  state: "live" | "expired" | "unpriced";
  isEstimate: boolean;
  pricing: { referenceTotal: Paise; bundlePrice: Paise; savings: Paise; discountPercent: number } | null;
};

export type SaleSources = {
  catalog: readonly PreviewProduct[];
  /** Official prices only. Never contains estimates. */
  pricing: Readonly<Record<string, ProductPricing>>;
  provisionalPricing: Readonly<Record<string, ProductPricing>>;
  pricingMode: PricingMode;
  /** Fallback when a combo has no entry in illustrativeBundlePercents. */
  illustrativeBundlePercent: number;
  illustrativeBundlePercents?: Readonly<Record<string, number>>;
  promotions: readonly Promotion[];
  bundles: readonly BundleDefinition[];
  campaign: Campaign;
  featuredCombo?: FeaturedComboConfig;
};

/** Listed products are those with an eligible detail page and proposed collection membership. */
export function getListedProducts(catalog: readonly PreviewProduct[]): PreviewProduct[] {
  const seen = new Set<string>();
  return catalog.filter((product) => {
    if (seen.has(product.routeKey) || product.detailPageStatus !== "development-preview-eligible" || product.membershipStatus !== "proposed") return false;
    seen.add(product.routeKey);
    return true;
  });
}

function resolveFeatured(config: FeaturedComboConfig, resolveOffer: (bundle: BundleDefinition, previewPercent: number) => BundleOffer, now: number): FeaturedComboView {
  const offer = resolveOffer(config.bundle, config.previewDiscountPercent);
  const id = config.bundle.id;
  if (offer.kind !== "priced" && offer.kind !== "illustrative") return { id, state: "unpriced", isEstimate: false, pricing: null };
  const end = Date.parse(config.endsAt);
  return {
    id,
    // An unreadable deadline counts as ended, so no open-ended offer can appear by mistake.
    state: Number.isFinite(end) && now < end ? "live" : "expired",
    isEstimate: offer.kind === "illustrative",
    pricing: { referenceTotal: offer.referenceTotal, bundlePrice: offer.bundlePrice, savings: offer.savings, discountPercent: offer.discountPercent },
  };
}

export function buildSaleSnapshot(sources: SaleSources, now: number): SaleSnapshot {
  const listed = getListedProducts(sources.catalog);
  const listedIds = new Set(listed.map((product) => product.routeKey));
  const pricing = mergePricing(sources.pricing, sources.provisionalPricing, sources.pricingMode);
  const products = listed.map((product): SaleProductView => {
    const image = product.images.find((candidate) => candidate.approvalStatus === "approved");
    return {
      id: product.routeKey,
      name: product.name,
      href: `/products/${product.routeKey}`,
      collectionSlug: product.collectionSlug,
      image: image ? { src: image.src, alt: image.alt, focus: image.focus } : null,
      offer: resolveProductOffer(product.routeKey, pricing[product.routeKey], sources.promotions, now),
    };
  });
  const resolveOffer = (bundle: BundleDefinition, previewPercent: number): BundleOffer => {
    // Real bundle offers are resolved from official prices only.
    const offer = resolveBundleOffer(bundle, sources.pricing, listedIds);
    if (offer.kind !== "preview" || sources.pricingMode !== "development-preview") return offer;
    return resolveIllustrativeBundle(bundle, pricing, previewPercent) ?? offer;
  };
  const bundles = sources.bundles
    .map((bundle) => resolveOffer(bundle, sources.illustrativeBundlePercents?.[bundle.id] ?? sources.illustrativeBundlePercent))
    .filter((offer): offer is Exclude<BundleOffer, { kind: "ineligible" }> => offer.kind !== "ineligible");
  const campaignState = getCampaignState(sources.campaign, sources.promotions, now);
  return { campaignLive: campaignState === "active", campaignState, pricingMode: sources.pricingMode, products, bundles, featuredCombo: sources.featuredCombo ? resolveFeatured(sources.featuredCombo, resolveOffer, now) : null };
}
