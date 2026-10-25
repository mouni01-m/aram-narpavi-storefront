import type { PreviewProduct } from "../content/catalog-preview";
import { getCampaignState, mergePricing, resolveBundleOffer, resolveIllustrativeBundle, resolveProductOffer, type BundleDefinition, type BundleOffer, type Campaign, type CampaignState, type PricingMode, type ProductPricing, type Promotion } from "./pricing";
import type { SaleProductView } from "./sale-filters";

export type SaleSnapshot = {
  campaignLive: boolean;
  campaignState: CampaignState;
  pricingMode: PricingMode;
  products: SaleProductView[];
  /** Bundles that may be shown: priced, illustrative (preview estimates) or labelled previews. */
  bundles: Exclude<BundleOffer, { kind: "ineligible" }>[];
};

export type SaleSources = {
  catalog: readonly PreviewProduct[];
  /** Official prices only. Never contains estimates. */
  pricing: Readonly<Record<string, ProductPricing>>;
  provisionalPricing: Readonly<Record<string, ProductPricing>>;
  pricingMode: PricingMode;
  illustrativeBundlePercent: number;
  promotions: readonly Promotion[];
  bundles: readonly BundleDefinition[];
  campaign: Campaign;
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
  const bundles = sources.bundles
    .map((bundle): BundleOffer => {
      // Real bundle offers are resolved from official prices only.
      const offer = resolveBundleOffer(bundle, sources.pricing, listedIds);
      if (offer.kind !== "preview" || sources.pricingMode !== "development-preview") return offer;
      return resolveIllustrativeBundle(bundle, pricing, sources.illustrativeBundlePercent) ?? offer;
    })
    .filter((offer): offer is Exclude<BundleOffer, { kind: "ineligible" }> => offer.kind !== "ineligible");
  const campaignState = getCampaignState(sources.campaign, sources.promotions, now);
  return { campaignLive: campaignState === "active", campaignState, pricingMode: sources.pricingMode, products, bundles };
}
