export type ContentReviewState = "brand-provided" | "draft" | "development-preview" | "proposed";

/**
 * Static homepage presentation content only. Proposed categories, draft copy, and
 * development sample names are not an approved catalogue or source of commerce truth.
 */
export const homepageContent = {
  hero: {
    heading: "Everyday rituals, rooted in tradition.",
    supportingCopy: "Explore the Aram Narpavi Herbals range of personal-care and pantry products. Review product-specific information and choose with the details you need.",
    tagline: "Nature’s Purity, Tradition’s Healing",
    taglineStatus: "brand-provided" satisfies ContentReviewState,
  },
  categories: [
    {
      name: "Herbal Soaps",
      intro: "Browse the proposed soap grouping. Product membership remains under review.",
      status: "proposed" satisfies ContentReviewState,
      style: "soap",
    },
    {
      name: "Traditional Mixes",
      intro: "Explore a proposed grouping for malt, kanji and soup mixes. Product details remain under review.",
      status: "proposed" satisfies ContentReviewState,
      style: "mixes",
    },
    {
      name: "Pantry Essentials",
      intro: "Browse a proposed grouping of pantry products. Product membership remains under review.",
      status: "proposed" satisfies ContentReviewState,
      style: "pantry",
    },
    {
      name: "Oils & Balms",
      intro: "Product category and intended use still need review.",
      status: "proposed" satisfies ContentReviewState,
      style: "oils",
    },
  ],
  featuredProducts: [
    { name: "Charcoal Soap", status: "development-preview" satisfies ContentReviewState },
    { name: "Manjistha Soap", status: "development-preview" satisfies ContentReviewState },
    { name: "ABC Malt", status: "development-preview" satisfies ContentReviewState },
    { name: "Honey", status: "development-preview" satisfies ContentReviewState },
  ],
  philosophy: {
    heading: "Herbal care, rooted in tradition.",
    body: "Discover herbal soaps and pantry favourites from Aram Narpavi Herbals, thoughtfully presented with clear product details for everyday routines.",
    status: "draft" satisfies ContentReviewState,
  },
  faqPreview: [
    {
      question: "Where can I find product ingredients?",
      answer: "Ingredient information will be published after it has been checked against the current approved product label.",
    },
    {
      question: "How do I use a product?",
      answer: "Follow the directions on each product’s approved label. Product-specific directions will be added when verified.",
    },
    {
      question: "How are delivery charges calculated?",
      answer: "Delivery options and charges have not yet been confirmed for this storefront.",
    },
  ],
} as const;

export const homepageMeta = {
  title: "Aram Narpavi Herbals | Herbal soaps and pantry favourites",
  description: "Discover Aram Narpavi Herbals: traditional herbal soaps, personal-care essentials and pantry favourites, with clear product details for everyday routines.",
};
