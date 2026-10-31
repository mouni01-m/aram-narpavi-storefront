import { homepageContent, type ContentReviewState } from "@/lib/content/homepage";

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
  approvalStatus: "approved";
};

export const previewCollections = [
  { slug: "herbal-soaps", title: "Herbal Soaps", introduction: "A proposed grouping for soap products. Product details and classification are pending review.", status: "proposed", membershipStatus: "draft" },
  { slug: "traditional-mixes", title: "Traditional Mixes", introduction: "A proposed grouping for traditional mixes. Product details and classification are pending review.", status: "proposed", membershipStatus: "draft" },
  { slug: "pantry-essentials", title: "Pantry Essentials", introduction: "A proposed grouping for pantry products. Product details and classification are pending review.", status: "proposed", membershipStatus: "draft" },
  { slug: "oils-and-balms", title: "Oils & Balms", introduction: "This proposed grouping needs classification and intended-use review before products can be shown.", status: "proposed", membershipStatus: "draft" },
] as const satisfies readonly PreviewCollection[];

// Oils & Balms stays directly addressable but out of normal discovery pending classification.
export const discoverablePreviewCollections = previewCollections.filter((collection) => collection.slug !== "oils-and-balms");

// Memberships below are provisional presentation choices, not approved catalogue classifications.
export const catalogPreviewProducts: readonly PreviewProduct[] = [
  { routeKey: "charcoal-soap", name: homepageContent.featuredProducts[0].name, status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "herbal-soaps", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: null, images: [{ src: "/images/products/charcoal-soap/Botanical_Charcoal_Soap_Spa_Advertisement.png", alt: "Botanical Aram Narpavi Charcoal Soap spa advertisement", approvalStatus: "approved" }] },
  { routeKey: "manjistha-soap", name: homepageContent.featuredProducts[1].name, status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "herbal-soaps", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: null, images: [] },
  { routeKey: "abc-malt", name: homepageContent.featuredProducts[2].name, status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "traditional-mixes", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: null, images: [{ src: "/images/products/abc-malt/Joyful_Family_with_ABC_Malt_Drink.png", alt: "Joyful family enjoying ABC Malt drink from Aram Narpavi Herbals", approvalStatus: "approved" }] },
  { routeKey: "honey", name: homepageContent.featuredProducts[3].name, status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "pantry-essentials", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: null, images: [] },
];

export function getPreviewCollection(slug: string) {
  return previewCollections.find((collection) => collection.slug === slug);
}

export function getPreviewProduct(routeKey: string) {
  return catalogPreviewProducts.find((product) => product.routeKey === routeKey && product.detailPageStatus === "development-preview-eligible");
}
