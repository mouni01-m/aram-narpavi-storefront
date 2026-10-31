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
  packSize: string | null;
  tentativePriceInr: number | null;
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

// Memberships and prices below are provisional. Prices are tentative and not confirmed for sale.
export const catalogPreviewProducts: readonly PreviewProduct[] = [
  { routeKey: "charcoal-soap", name: homepageContent.featuredProducts[0].name, status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "herbal-soaps", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "100 g", tentativePriceInr: 149, images: [{ src: "/images/products/charcoal-soap/Botanical_Charcoal_Soap_Spa_Advertisement.png", alt: "Botanical Aram Narpavi Charcoal Soap spa advertisement", approvalStatus: "approved" }] },
  { routeKey: "manjistha-soap", name: homepageContent.featuredProducts[1].name, status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "herbal-soaps", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "100 g", tentativePriceInr: 149, images: [{ src: "/images/products/soaps/manjistha_soap_1.webp", alt: "Aram Narpavi Manjistha Soap", approvalStatus: "approved" }] },
  { routeKey: "abc-malt", name: homepageContent.featuredProducts[2].name, status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "traditional-mixes", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "250 g", tentativePriceInr: 279, images: [{ src: "/images/products/abc-malt/Joyful_Family_with_ABC_Malt_Drink.png", alt: "Joyful family enjoying ABC Malt drink from Aram Narpavi Herbals", approvalStatus: "approved" }] },
  { routeKey: "honey", name: homepageContent.featuredProducts[3].name, status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "pantry-essentials", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "250 g", tentativePriceInr: 199, images: [{ src: "/images/products/pantry/honey.webp", alt: "Aram Narpavi Honey", approvalStatus: "approved" }] },
  { routeKey: "kuppameni-soap", name: "Kuppameni Soap", status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "herbal-soaps", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "100 g", tentativePriceInr: 129, images: [{ src: "/images/products/soaps/kuppameni_soap_1.webp", alt: "Aram Narpavi Kuppameni Soap", approvalStatus: "approved" }] },
  { routeKey: "nalangumavu-soap", name: "Nalangumavu Soap", status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "herbal-soaps", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "100 g", tentativePriceInr: 129, images: [{ src: "/images/products/soaps/nalangumavu-soap.webp", alt: "Aram Narpavi Nalangumavu Soap", approvalStatus: "approved" }] },
  { routeKey: "multani-mitti-soap", name: "Multani Mitti Soap", status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "herbal-soaps", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "100 g", tentativePriceInr: 129, images: [{ src: "/images/products/soaps/multani-mitti-soap.webp", alt: "Aram Narpavi Multani Mitti Soap", approvalStatus: "approved" }] },
  { routeKey: "beetroot-malt", name: "Beetroot Malt", status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "traditional-mixes", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "250 g", tentativePriceInr: 249, images: [{ src: "/images/products/mixes/beetroot-malt.webp", alt: "Aram Narpavi Beetroot Malt", approvalStatus: "approved" }] },
  { routeKey: "karuppu-kavuni-kanji-mix", name: "Karuppu Kavuni Kanji Mix", status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "traditional-mixes", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "250 g", tentativePriceInr: 229, images: [{ src: "/images/products/mixes/karuppu-kavuni-kanji-mix.webp", alt: "Aram Narpavi Karuppu Kavuni Kanji Mix", approvalStatus: "approved" }] },
  { routeKey: "instant-moringa-soup-mix", name: "Instant Moringa Soup Mix", status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "traditional-mixes", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "100 g", tentativePriceInr: 149, images: [] },
  { routeKey: "gulkand", name: "Gulkand", status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "pantry-essentials", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "250 g", tentativePriceInr: 179, images: [{ src: "/images/products/pantry/gulkand.webp", alt: "Aram Narpavi Gulkand", approvalStatus: "approved" }] },
  { routeKey: "asafoetida", name: "Asafoetida", status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "pantry-essentials", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "50 g", tentativePriceInr: 99, images: [{ src: "/images/products/pantry/asafoetida.webp", alt: "Aram Narpavi Asafoetida", approvalStatus: "approved" }] },
  { routeKey: "desi-ghee", name: "Desi Ghee", status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "pantry-essentials", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "200 g", tentativePriceInr: 249, images: [{ src: "/images/products/pantry/desi-ghee.webp", alt: "Aram Narpavi Desi Ghee", approvalStatus: "approved" }] },
  { routeKey: "coconut-oil", name: "Coconut Oil", status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "oils-and-balms", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "200 ml", tentativePriceInr: 179, images: [{ src: "/images/products/oils-and-balms/coconut-oil.webp", alt: "Aram Narpavi Coconut Oil", approvalStatus: "approved" }] },
  { routeKey: "herbal-pain-balm", name: "Herbal Pain Balm", status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "oils-and-balms", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "25 g", tentativePriceInr: 99, images: [{ src: "/images/products/oils-and-balms/herbal-pain-balm.webp", alt: "Aram Narpavi Herbal Pain Balm", approvalStatus: "approved" }] },
  { routeKey: "karpooravalli-thailam", name: "Karpooravalli Thailam", status: "development-preview", detailPageStatus: "development-preview-eligible", collectionSlug: "oils-and-balms", membershipStatus: "proposed", description: null, descriptionStatus: "awaiting-verification", packSize: "100 ml", tentativePriceInr: 149, images: [{ src: "/images/products/oils-and-balms/karpooravalli-thailam.webp", alt: "Aram Narpavi Karpooravalli Thailam", approvalStatus: "approved" }] },
];

export function getPreviewCollection(slug: string) {
  return previewCollections.find((collection) => collection.slug === slug);
}

export function getPreviewProduct(routeKey: string) {
  return catalogPreviewProducts.find((product) => product.routeKey === routeKey && product.detailPageStatus === "development-preview-eligible");
}
