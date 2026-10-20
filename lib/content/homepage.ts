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
    heading: "Rooted in tradition. Made for everyday routines.",
    body: "Aram Narpavi Herbals brings together a considered range of personal-care and pantry products. We aim to make product information easier to understand, with clear details drawn from approved labels.",
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
  title: "Aram Narpavi Herbals | Everyday rituals, rooted in tradition",
  description:
    "Explore the Aram Narpavi Herbals storefront. Product availability, verified product details and delivery information will appear when confirmed.",
};
