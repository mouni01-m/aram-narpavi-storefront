import type { Paise, ProductOffer } from "./pricing";

/** Display-ready product, resolved on the server so the browser never decides an offer. */
export type SaleProductView = {
  id: string;
  name: string;
  href: string;
  collectionSlug: string | null;
  image: { src: string; alt: string; focus?: string } | null;
  offer: ProductOffer;
};

export type SaleSort = "recommended" | "price-asc" | "price-desc" | "savings-desc";

export type SaleFilters = {
  query: string;
  collection: string;
  /** Whole rupees; null means no bound. */
  minPrice: number | null;
  maxPrice: number | null;
  /** Minimum active discount percentage; 0 means any. */
  minDiscount: number;
  inStockOnly: boolean;
  sort: SaleSort;
};

export const defaultSaleFilters: SaleFilters = {
  query: "",
  collection: "all",
  minPrice: null,
  maxPrice: null,
  minDiscount: 0,
  inStockOnly: false,
  sort: "recommended",
};

/** Provisional estimates take part in price filtering and sorting, never in discounts. */
export function priceOf(product: SaleProductView): Paise | null {
  if (product.offer.kind === "priced") return product.offer.finalPrice;
  return product.offer.kind === "provisional" ? product.offer.price : null;
}

/** Savings count only for purchasable lines, so unavailable products never rank as deals. */
function savingsOf(product: SaleProductView): Paise {
  return product.offer.kind === "priced" && product.offer.availability === "in-stock" ? product.offer.savings : 0;
}

export function filterSaleProducts(products: readonly SaleProductView[], filters: SaleFilters): SaleProductView[] {
  const query = filters.query.trim().toLocaleLowerCase();
  const seen = new Set<string>();
  const rank = new Map(products.map((product, index) => [product.id, index]));

  const matches = products.filter((product) => {
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    if (query && !product.name.toLocaleLowerCase().includes(query)) return false;
    if (filters.collection !== "all" && product.collectionSlug !== filters.collection) return false;
    const price = priceOf(product);
    if (filters.minPrice !== null && (price === null || price < filters.minPrice * 100)) return false;
    if (filters.maxPrice !== null && (price === null || price > filters.maxPrice * 100)) return false;
    if (filters.inStockOnly && !(product.offer.kind === "priced" && product.offer.availability === "in-stock")) return false;
    if (filters.minDiscount > 0) {
      const { offer } = product;
      if (offer.kind !== "priced" || offer.availability !== "in-stock" || offer.discountPercent < filters.minDiscount) return false;
    }
    return true;
  });

  const byRank = (a: SaleProductView, b: SaleProductView) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0);
  // Unpriced products sort after priced ones in either price direction.
  const byPrice = (direction: 1 | -1) => (a: SaleProductView, b: SaleProductView) => {
    const priceA = priceOf(a);
    const priceB = priceOf(b);
    if (priceA === null || priceB === null) return priceA === priceB ? byRank(a, b) : priceA === null ? 1 : -1;
    return (priceA - priceB) * direction || byRank(a, b);
  };

  switch (filters.sort) {
    case "price-asc": return matches.sort(byPrice(1));
    case "price-desc": return matches.sort(byPrice(-1));
    case "savings-desc": return matches.sort((a, b) => savingsOf(b) - savingsOf(a) || byRank(a, b));
    default: return matches.sort(byRank);
  }
}

/** Discount thresholds offered in the filter, derived only from live, purchasable discounts. */
export function getDiscountOptions(products: readonly SaleProductView[]): number[] {
  const percents = new Set<number>();
  for (const { offer } of products) {
    if (offer.kind === "priced" && offer.availability === "in-stock" && offer.discountPercent > 0) {
      for (const step of [5, 10, 15]) if (offer.discountPercent >= step) percents.add(step);
    }
  }
  return [...percents].sort((a, b) => a - b);
}

export function hasActiveFilters(filters: SaleFilters): boolean {
  return filters.query.trim() !== "" || filters.collection !== "all" || filters.minPrice !== null || filters.maxPrice !== null
    || filters.minDiscount > 0 || filters.inStockOnly || filters.sort !== "recommended";
}
