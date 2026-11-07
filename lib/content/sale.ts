/**
 * Heritage Sale copy. "live" copy is used only while the campaign and at least one
 * promotion are live (see lib/commerce/pricing.ts); otherwise the neutral "preview"
 * copy is shown so no saving is implied.
 */
/**
 * Draft one-line notes for the combo popup, until verified descriptions are supplied.
 * They say what a product is and make no health or benefit claims.
 */
export const comboItemNotes: Readonly<Record<string, string>> = {
  "charcoal-soap": "A charcoal bath soap for everyday use.",
  "manjistha-soap": "A bath soap featuring manjistha, a traditional herb.",
  "kuppameni-soap": "A bath soap featuring kuppameni, a traditional herb.",
  "nalangumavu-soap": "A soap inspired by nalangumavu, the traditional bath powder.",
  "multani-mitti-soap": "A bath soap made with multani mitti (fuller's earth).",
  "abc-malt": "A malt drink mix of apple, beetroot and carrot.",
  "beetroot-malt": "A malt drink mix made with beetroot.",
  "karuppu-kavuni-kanji-mix": "A porridge mix made with karuppu kavuni black rice.",
  "instant-moringa-soup-mix": "An instant soup mix made with moringa.",
  honey: "Honey for the everyday pantry.",
  gulkand: "A sweet preserve made from rose petals.",
  asafoetida: "Hing, a traditional kitchen seasoning.",
  "desi-ghee": "Clarified butter for everyday cooking.",
  "coconut-oil": "Coconut oil for everyday routines.",
  "herbal-pain-balm": "A herbal balm in a compact jar.",
  "karpooravalli-thailam": "A traditional oil made with karpooravalli.",
};

/** Draft search keywords per collection. They describe what a product is, not what it does. */
export const collectionSearchKeywords: Readonly<Record<string, readonly string[]>> = {
  "herbal-soaps": ["soap", "bath", "skin care", "skincare"],
  "traditional-mixes": ["mix", "malt", "drink", "porridge", "soup", "nutrition"],
  "pantry-essentials": ["pantry", "kitchen", "food"],
  "oils-and-balms": ["oil", "balm"],
};

export const productSearchKeywords: Readonly<Record<string, readonly string[]>> = {
  asafoetida: ["perungayam"],
  gulkand: ["rose"],
  "coconut-oil": ["hair", "hair care"],
};

/** Rotating header placeholder terms. Each must return at least one product. */
export const searchSuggestions: readonly string[] = ["Charcoal Soap", "ABC Malt", "Honey", "Herbal Pain Balm", "Skin Care", "Coconut Oil", "Gulkand"];

export const saleContent = {
  combos: {
    heading: "Made to Go Together",
    live: "Explore curated combinations of everyday favourites and save on eligible bundles.",
    preview: "Curated combinations of everyday favourites. Combo prices shown are illustrative estimates until they are approved.",
  },
  products: {
    live: { heading: "Discover the Sale", copy: "Find your everyday favourites across the Aram Narpavi range." },
    preview: { heading: "Discover the Range", copy: "Find your everyday favourites across the Aram Narpavi range." },
  },
  information: {
    heading: "Rooted in Tradition. Made for Everyday.",
    copy: "Aram Narpavi Herbals brings together herbal soaps, traditional mixes and pantry favourites for everyday routines.",
  },
  /** Copy for the dedicated campaign page at /sale-products. */
  campaign: {
    announcement: {
      active: "The Heritage Sale · Discover special savings on selected essentials",
      upcoming: "The Heritage Sale · Opening soon",
      ended: "The Heritage Sale has ended · Thank you for shopping with us",
      preview: "The Heritage Sale · Preview · Offers open once prices are approved",
    },
    hero: {
      eyebrow: "The Aram Narpavi Heritage Sale",
      heading: "A Little More Tradition. A Little More to Save.",
      endedHeading: "A Little More Tradition.",
      copy: "Discover thoughtfully curated herbal essentials, traditional mixes and pantry favourites in a celebration of everyday heritage.",
      tagline: "Nature’s Purity, Tradition’s Healing",
      primary: "Explore the sale",
      secondary: "Shop curated combos",
      status: {
        upcoming: "The Heritage Sale opens",
        ended: "The Heritage Sale has ended. Everyday prices apply.",
        preview: "Sale preview · Offer prices are announced once approved.",
      },
    },
    combos: {
      eyebrow: "Curated combinations",
      copy: "Discover thoughtfully grouped favourites from across the Aram Narpavi range.",
      previewNote: "Combo prices shown are preview estimates until they are approved.",
    },
    spotlight: {
      eyebrow: "In the spotlight",
      heading: "Tradition, thoughtfully brought into your everyday.",
    },
    products: {
      heading: "Find Your Favourites",
      copy: "Explore the full Aram Narpavi collection and discover products that fit your everyday rituals.",
    },
  },
} as const;
