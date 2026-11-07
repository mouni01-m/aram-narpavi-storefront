/**
 * Single source of truth for product photography, keyed by product route key.
 *
 * Every path here must exist under public/ (enforced by lib/commerce/sale.test.cjs).
 * The first image is the card/thumbnail image. Products without an entry render the
 * neutral named placeholder; see docs/MISSING_PRODUCT_IMAGES.md.
 */
export type ProductImageKind = "product" | "lifestyle" | "campaign";

export type ProductImage = {
  src: string;
  alt: string;
  kind: ProductImageKind;
  /** CSS object-position for cropped frames, so packaging stays in view. */
  focus?: string;
};

export const productImages: Readonly<Record<string, readonly ProductImage[]>> = {
  "charcoal-soap": [
    { src: "/images/products/soaps/charcoal_soap_1.webp", alt: "Aram Narpavi Charcoal Soap bar beside its grey branded box", kind: "product" },
    { src: "/images/products/soaps/charcoal_soap_4.webp", alt: "Aram Narpavi Charcoal Soap and box on a bathroom counter", kind: "lifestyle" },
  ],
  "manjistha-soap": [
    { src: "/images/products/soaps/manjistha_soap_1.webp", alt: "Aram Narpavi Manjistha Soap bar beside its red branded box", kind: "product" },
    { src: "/images/products/soaps/manjistha_soap_4.webp", alt: "Aram Narpavi Manjistha Soap and box on a bathroom counter", kind: "lifestyle" },
  ],
  "kuppameni-soap": [
    { src: "/images/products/soaps/kuppameni_soap_1.webp", alt: "Aram Narpavi Kuppameni Soap bar beside its green branded box", kind: "product" },
    { src: "/images/products/soaps/kuppameni_soap_4.webp", alt: "Aram Narpavi Kuppameni Soap and box on a bathroom counter", kind: "lifestyle" },
  ],
  "nalangumavu-soap": [
    { src: "/images/products/soaps/nalangumavu-soap.webp", alt: "Aram Narpavi Nalangumavu Soap bar with a paper band label on a stone slab", kind: "product" },
  ],
  "multani-mitti-soap": [
    { src: "/images/products/soaps/multani-mitti-soap.webp", alt: "Aram Narpavi Multani Mitti Soap bar beside fuller's earth powder", kind: "product" },
  ],
  // No standalone pack shot exists; this campaign photograph shows the real ABC Malt pouch.
  "abc-malt": [
    { src: "/images/home/campaigns/abc-malt-family.png", alt: "Aram Narpavi ABC Malt pouch on a family breakfast table", kind: "campaign", focus: "88% 62%" },
  ],
  "beetroot-malt": [
    { src: "/images/products/mixes/beetroot-malt.webp", alt: "Beetroot Malt powder in a labelled glass jar beside fresh beetroots", kind: "product" },
  ],
  "karuppu-kavuni-kanji-mix": [
    { src: "/images/products/mixes/karuppu-kavuni-kanji-mix.webp", alt: "Aram Narpavi Karuppu Kavuni Kanji Mix in a kraft stand-up pouch beside black rice", kind: "product" },
    { src: "/images/products/mixes/karuppu-kavuni-kanji-mix-lifestyle.webp", alt: "Karuppu Kavuni Kanji Mix pouch beside a bowl of black rice porridge", kind: "lifestyle" },
  ],
  "instant-moringa-soup-mix": [
    { src: "/images/products/mixes/instant-moringa-soup-mix.webp", alt: "Aram Narpavi Instant Moringa Soup Mix in a glass jar with a wooden lid", kind: "product" },
    { src: "/images/products/mixes/instant-moringa-soup-mix-pouch.webp", alt: "Instant Moringa Soup Mix pouch beside fresh moringa leaves", kind: "product" },
  ],
  honey: [
    { src: "/images/products/pantry/honey.webp", alt: "Aram Narpavi Honey in a glass jar with a wooden lid", kind: "product" },
  ],
  gulkand: [
    { src: "/images/products/pantry/gulkand.webp", alt: "Aram Narpavi Gulkand rose petal preserve in a glass jar", kind: "product" },
  ],
  "desi-ghee": [
    { src: "/images/products/pantry/desi-ghee.webp", alt: "Desi Ghee in a glass jar with an Aram Narpavi Herbals label", kind: "product" },
  ],
  asafoetida: [
    { src: "/images/products/pantry/asafoetida.webp", alt: "Aram Narpavi Asafoetida (hing) in a ceramic jar beside a spoon of powder", kind: "product" },
  ],
  "coconut-oil": [
    { src: "/images/products/oils-and-balms/coconut-oil.webp", alt: "Aram Narpavi Coconut Oil in a clear glass bottle beside a coconut piece", kind: "product" },
  ],
  "herbal-pain-balm": [
    { src: "/images/products/oils-and-balms/herbal-pain-balm.webp", alt: "Aram Narpavi Herbal Pain Balm in a frosted glass jar", kind: "product" },
  ],
  "karpooravalli-thailam": [
    { src: "/images/products/oils-and-balms/karpooravalli-thailam.webp", alt: "Aram Narpavi Karpooravalli Thailam in an amber dropper bottle beside karpooravalli leaves", kind: "product" },
  ],
};

export function getProductImages(productId: string): readonly ProductImage[] {
  return productImages[productId] ?? [];
}
