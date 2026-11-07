/** Optional brand imagery. Add matching files under public/ to replace each designed fallback. */
export const imageAssets = {
  /**
   * The owner's logo, trimmed from aram-narpavi-logo.png with only its flat grey background
   * removed. Its colours and proportions are unchanged. See docs/BRAND_DESIGN.md.
   */
  brand: { logo: { src: "/images/brand/aram-narpavi-logo-mark.png", width: 495, height: 264 } },
  home: { hero: "/images/home/hero-products.webp", story: "/images/home/brand-story.webp" },
  categories: {
    "herbal-soaps": "/images/categories/herbal-soaps.webp",
    "traditional-mixes": "/images/categories/traditional-mixes.webp",
    "pantry-essentials": "/images/categories/pantry-essentials.webp",
    "oils-and-balms": "/images/categories/oils-and-balms.webp",
  },
  /** Transparent product groupings for the collection grid; see docs/SALE_EXPERIENCE.md. */
  collectionCutouts: {
    "herbal-soaps": "/images/categories/cutouts/herbal-soaps.webp",
    "traditional-mixes": "/images/categories/cutouts/traditional-mixes.webp",
    "pantry-essentials": "/images/categories/cutouts/pantry-essentials.webp",
    "oils-and-balms": "/images/categories/cutouts/oils-and-balms.webp",
  },
} as const;
