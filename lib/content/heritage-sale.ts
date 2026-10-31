/** Editable Heritage Sale offer. Leave offerText null until the business approves real savings and dates. */
export const heritageSale = {
  enabled: true,
  eyebrow: "Heritage Sale · Limited time",
  title: "Natural favourites, thoughtfully priced.",
  description: "Selected herbal and pantry favourites from Aram Narpavi Herbals, presented during the Heritage Sale.",
  offerText: null as string | null,
  placeholderOfferText: "Offer details are being confirmed. The Heritage Sale page will show verified eligible products and savings.",
  image: { src: "/images/banners/festival-banner.webp", alt: "Aram Narpavi Heritage Sale campaign with herbal products" },
  ctaLabel: "Shop Now",
  ctaHref: "/heritage-sale",
  openDelayMs: 1200,
  sessionKey: "aram-heritage-sale-popup-shown",
} as const;
