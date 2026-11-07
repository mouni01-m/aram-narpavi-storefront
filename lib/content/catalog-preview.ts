import { homepageContent, type ContentReviewState } from "@/lib/content/homepage";
import { getProductImages } from "@/lib/content/product-images";

export type PreviewCollection = {
  slug: string;
  title: string;
  introduction: string;
  status: "proposed";
  membershipStatus: "draft";
};

export type PreviewProduct = {
  routeKey: string;
  name: string;
  status: "development-preview";
  detailPageStatus: "development-preview-eligible";
  collectionSlug: string | null;
  membershipStatus: ContentReviewState;
  description: null;
  descriptionStatus: "awaiting-verification";
  packSize: null;
  images: readonly PreviewProductImage[];
};

export type PreviewProductImage = {
  src: string;
  alt: string;
  focus?: string;
  approvalStatus: "approved";
};

export const previewCollections = [
  { slug: "herbal-soaps", title: "Herbal Soaps", introduction: "A proposed grouping for soap products. Product details and classification are pending review.", status: "proposed", membershipStatus: "draft" },
  { slug: "traditional-mixes", title: "Traditional Mixes", introduction: "A proposed grouping for traditional mixes. Product details and classification are pending review.", status: "proposed", membershipStatus: "draft" },
  { slug: "pantry-essentials", title: "Pantry Essentials", introduction: "A proposed grouping for pantry products. Product details and classification are pending review.", status: "proposed", membershipStatus: "draft" },
  { slug: "oils-and-balms", title: "Oils & Balms", introduction: "A proposed grouping for oils and balms. Product details and classification are pending review.", status: "proposed", membershipStatus: "draft" },
] as const satisfies readonly PreviewCollection[];

export const discoverablePreviewCollections = previewCollections;

// Memberships below are provisional presentation choices, not approved catalogue classifications.
// Names after the first four come from the owner-supplied range list; details still need verification.
export const catalogPreviewProducts: readonly PreviewProduct[] = [
  previewProduct("charcoal-soap", homepageContent.featuredProducts[0].name, "herbal-soaps"),
  previewProduct("manjistha-soap", homepageContent.featuredProducts[1].name, "herbal-soaps"),
  previewProduct("abc-malt", homepageContent.featuredProducts[2].name, "traditional-mixes"),
  previewProduct("honey", homepageContent.featuredProducts[3].name, "pantry-essentials"),
  previewProduct("kuppameni-soap", "Kuppameni Soap", "herbal-soaps"),
  previewProduct("nalangumavu-soap", "Nalangumavu Soap", "herbal-soaps"),
  previewProduct("multani-mitti-soap", "Multani Mitti Soap", "herbal-soaps"),
  previewProduct("beetroot-malt", "Beetroot Malt", "traditional-mixes"),
  previewProduct("karuppu-kavuni-kanji-mix", "Karuppu Kavuni Kanji Mix", "traditional-mixes"),
  previewProduct("instant-moringa-soup-mix", "Instant Moringa Soup Mix", "traditional-mixes"),
  previewProduct("gulkand", "Gulkand", "pantry-essentials"),
  previewProduct("asafoetida", "Asafoetida", "pantry-essentials"),
  previewProduct("desi-ghee", "Desi Ghee", "pantry-essentials"),
  previewProduct("coconut-oil", "Coconut Oil", "oils-and-balms"),
  previewProduct("herbal-pain-balm", "Herbal Pain Balm", "oils-and-balms"),
  previewProduct("karpooravalli-thailam", "Karpooravalli Thailam", "oils-and-balms"),
];

/** Images always come from the central registry in lib/content/product-images.ts. */
function previewProduct(routeKey: string, name: string, collectionSlug: string): PreviewProduct {
  const images = getProductImages(routeKey).map(({ src, alt, focus }) => ({ src, alt, focus, approvalStatus: "approved" as const }));
  return { routeKey, name, status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug, membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: null, images };
}

export function getPreviewCollection(slug: string) {
  return previewCollections.find((collection) => collection.slug === slug);
}

export function getPreviewProduct(routeKey: string) {
  return catalogPreviewProducts.find((product) => product.routeKey === routeKey && product.detailPageStatus === "development-preview-eligible");
}
