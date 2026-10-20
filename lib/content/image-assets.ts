/** Optional brand imagery. Add matching files under public/ to replace each designed fallback. */
export const imageAssets = {
  brand: { logo: "/images/brand/aram-narpavi-logo.svg" },
  home: { hero: "/images/home/hero-products.webp", story: "/images/home/brand-story.webp" },
  categories: {
    "herbal-soaps": "/images/categories/herbal-soaps.webp",
    "traditional-mixes": "/images/categories/traditional-mixes.webp",
    "pantry-essentials": "/images/categories/pantry-essentials.webp",
    "oils-and-balms": "/images/categories/oils-and-balms.webp",
  },
  products: {
    "charcoal-soap": "/images/products/charcoal-soap.webp",
    "manjistha-soap": "/images/products/manjistha-soap.webp",
    "abc-malt": "/images/products/abc-malt.webp",
    honey: "/images/products/honey.webp",
  },
} as const;
