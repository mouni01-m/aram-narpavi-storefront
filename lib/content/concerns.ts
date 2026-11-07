/**
 * Draft browsing guide for "Shop by Concern". Groupings help shoppers find products to
 * look at; they are not treatment claims and need owner approval. Product details always
 * come from the catalogue, so these entries hold only product ids. See docs/SHOP_BY_CONCERN.md.
 */
export type Concern = {
  slug: string;
  title: string;
  productIds: readonly string[];
  intro: string;
};

const hairNote = "Coconut Oil is the only hair-related product in our range today.";

export const concerns: readonly Concern[] = [
  {
    slug: "acne-and-blemishes",
    title: "Acne & Blemishes",
    productIds: ["charcoal-soap", "kuppameni-soap", "multani-mitti-soap"],
    intro: "Herbal soaps to look at for your everyday face and body wash.",
  },
  {
    slug: "pigmentation-and-uneven-tone",
    title: "Pigmentation & Uneven Tone",
    productIds: ["manjistha-soap", "nalangumavu-soap", "multani-mitti-soap"],
    intro: "Soaps made with traditional ingredients such as manjistha and nalangumavu.",
  },
  {
    slug: "dull-and-tired-skin",
    title: "Dull & Tired Skin",
    productIds: ["multani-mitti-soap", "nalangumavu-soap", "manjistha-soap"],
    intro: "Herbal soaps for a simple, refreshing bath-time routine.",
  },
  {
    slug: "dandruff",
    title: "Dandruff",
    productIds: ["coconut-oil"],
    intro: hairNote,
  },
  {
    slug: "hair-fall",
    title: "Hair Fall",
    productIds: ["coconut-oil"],
    intro: hairNote,
  },
  {
    slug: "dry-and-frizzy-hair",
    title: "Dry & Frizzy Hair",
    productIds: ["coconut-oil"],
    intro: hairNote,
  },
  {
    slug: "general-wellness",
    title: "General Wellness",
    productIds: ["abc-malt", "beetroot-malt", "karuppu-kavuni-kanji-mix", "instant-moringa-soup-mix", "honey", "gulkand"],
    intro: "Traditional mixes and pantry favourites for your everyday routine.",
  },
  {
    slug: "skin-hydration",
    title: "Skin Hydration",
    productIds: ["coconut-oil", "nalangumavu-soap"],
    intro: "An oil and a soap to look at for your daily skin routine.",
  },
];

export type ConcernGroup = {
  id: string;
  title: string;
  description: string;
  /** focus is a CSS object-position, so the subject stays in the cropped frame. */
  image: { src: string; focus?: string };
  /** Concern slugs in display order; each links to /concerns/<slug>. */
  concernSlugs: readonly string[];
};

/** The three homepage cards. Each groups its concerns, so all eight listing pages stay reachable. */
export const concernGroups: readonly ConcernGroup[] = [
  {
    id: "skin",
    title: "Skin",
    description: "Herbal soaps and an oil to explore for your daily skin routine.",
    image: { src: "/images/concern/concern-skin.webp", focus: "55% center" },
    concernSlugs: ["acne-and-blemishes", "pigmentation-and-uneven-tone", "dull-and-tired-skin", "skin-hydration"],
  },
  {
    id: "hair",
    title: "Hair",
    description: hairNote,
    image: { src: "/images/concern/concern-hair.webp", focus: "center 30%" },
    concernSlugs: ["dandruff", "hair-fall", "dry-and-frizzy-hair"],
  },
  {
    id: "wellness",
    title: "Wellness",
    description: "Traditional mixes and pantry favourites for your everyday routine.",
    image: { src: "/images/concern/concern-wellness.webp", focus: "center" },
    concernSlugs: ["general-wellness"],
  },
];

export function getConcern(slug: string) {
  return concerns.find((concern) => concern.slug === slug);
}
