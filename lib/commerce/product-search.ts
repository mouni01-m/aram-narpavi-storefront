import type { ProductOffer } from "./pricing";
import type { SaleProductView } from "./sale-filters";

/** One catalogue product, shaped for the header search. Built from the live sale snapshot. */
export type SearchableProduct = {
  id: string;
  name: string;
  href: string;
  category: string | null;
  description: string | null;
  keywords: readonly string[];
  image: SaleProductView["image"];
  offer: ProductOffer;
};

export type HighlightPart = { text: string; match: boolean };

const STOP_WORDS = new Set(["a", "an", "and", "for", "in", "of", "the", "with"]);

const WEIGHTS = { name: 100, keywords: 40, category: 30, description: 20 };

function normalize(value: string): string {
  return value.toLocaleLowerCase("en").normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function tokensOf(query: string): string[] {
  const tokens = normalize(query).split(" ").filter(Boolean);
  const meaningful = tokens.filter((token) => !STOP_WORDS.has(token));
  return meaningful.length ? meaningful : tokens;
}

/** Word starts count fully; mid-word matches ("coal" in charcoal) need 3+ letters and count half. */
function matchStrength(field: string, token: string): number {
  if (field.startsWith(token) || field.includes(` ${token}`)) return 1;
  return token.length >= 3 && field.includes(token) ? 0.5 : 0;
}

export function buildSearchIndex(
  products: readonly SaleProductView[],
  sources: {
    collections: readonly { slug: string; title: string }[];
    descriptions: Readonly<Record<string, string>>;
    collectionKeywords: Readonly<Record<string, readonly string[]>>;
    productKeywords: Readonly<Record<string, readonly string[]>>;
  },
): SearchableProduct[] {
  const titles = new Map(sources.collections.map((collection) => [collection.slug, collection.title]));
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    href: product.href,
    category: product.collectionSlug ? titles.get(product.collectionSlug) ?? null : null,
    description: sources.descriptions[product.id] ?? null,
    keywords: [...(product.collectionSlug ? sources.collectionKeywords[product.collectionSlug] ?? [] : []), ...(sources.productKeywords[product.id] ?? [])],
    image: product.image,
    offer: product.offer,
  }));
}

/** Every search word must match somewhere; the best name match ranks first, then catalogue order. */
export function searchProducts(products: readonly SearchableProduct[], query: string): SearchableProduct[] {
  const tokens = tokensOf(query);
  if (!tokens.length) return [];
  const phrase = tokens.join(" ");

  const scored = products.map((product, rank) => {
    const name = normalize(product.name);
    const fields = [
      { text: name, weight: WEIGHTS.name },
      { text: normalize(product.keywords.join(" ")), weight: WEIGHTS.keywords },
      { text: normalize(product.category ?? ""), weight: WEIGHTS.category },
      { text: normalize(product.description ?? ""), weight: WEIGHTS.description },
    ];
    let score = 0;
    for (const token of tokens) {
      const best = Math.max(...fields.map((field) => matchStrength(field.text, token) * field.weight));
      if (best === 0) return null;
      score += best;
    }
    if (name === phrase) score += 1000;
    else if (name.startsWith(phrase)) score += 200;
    else if (name.includes(phrase)) score += 100;
    return { product, score, rank };
  });

  return scored
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => b.score - a.score || a.rank - b.rank)
    .map((entry) => entry.product);
}

/** Split text into plain and matched parts, using the same matching rules as the search. */
export function highlightMatches(text: string, query: string): HighlightPart[] {
  const tokens = [...tokensOf(query)].sort((a, b) => b.length - a.length);
  if (!tokens.length) return [{ text, match: false }];
  const pattern = new RegExp(tokens.map((token) => (token.length >= 3 ? token : `\\b${token}`)).join("|"), "gi");
  const parts: HighlightPart[] = [];
  let cursor = 0;
  for (const found of text.matchAll(pattern)) {
    if (found.index > cursor) parts.push({ text: text.slice(cursor, found.index), match: false });
    parts.push({ text: found[0], match: true });
    cursor = found.index + found[0].length;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), match: false });
  return parts;
}
