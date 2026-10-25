"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { SaleProductCard } from "@/components/sale/sale-product-card";
import { defaultSaleFilters, filterSaleProducts, getDiscountOptions, hasActiveFilters, priceOf, type SaleFilters, type SaleProductView, type SaleSort } from "@/lib/commerce/sale-filters";

type CollectionOption = { slug: string; title: string };

const sortOptions: { value: SaleSort; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "savings-desc", label: "Biggest Savings" },
];

function parseRupees(value: string): number | null {
  if (!value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function track(name: "view_item_list" | "search" | "select_item", detail: Record<string, unknown> = {}) {
  window.dispatchEvent(new CustomEvent("storefront-analytics", { detail: { name, ...detail } }));
}

/** Searchable, filterable product grid shared by the homepage, shop and collection pages. */
export function SaleCatalog({ products, collections, fixedCollection, initialVisible }: {
  products: readonly SaleProductView[];
  collections: readonly CollectionOption[];
  /** Locks the grid to one collection (collection pages) and hides the collection filter. */
  fixedCollection?: string;
  /** Show only this many results until the shopper chooses "See more". */
  initialVisible?: number;
}) {
  const initialFilters = useMemo<SaleFilters>(() => ({ ...defaultSaleFilters, collection: fixedCollection ?? "all" }), [fixedCollection]);
  const [filters, setFilters] = useState<SaleFilters>(initialFilters);
  const sentList = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const gridId = useId();
  const gridRef = useRef<HTMLUListElement>(null);
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const panelId = useId();
  const results = useMemo(() => filterSaleProducts(products, filters), [products, filters]);
  const limited = initialVisible !== undefined && !expanded && results.length > initialVisible;
  const visible = limited ? results.slice(0, initialVisible) : results;
  const canCollapse = initialVisible !== undefined && expanded && results.length > initialVisible;
  const discountOptions = useMemo(() => getDiscountOptions(products), [products]);
  const anyPriced = products.some((product) => priceOf(product) !== null);
  const anyVerified = products.some((product) => product.offer.kind === "priced");
  const collectionTitles = useMemo(() => new Map(collections.map((collection) => [collection.slug, collection.title])), [collections]);
  const active = hasActiveFilters({ ...filters, collection: fixedCollection ? "all" : filters.collection });
  const rangeInverted = filters.minPrice !== null && filters.maxPrice !== null && filters.minPrice > filters.maxPrice;
  const update = (patch: Partial<SaleFilters>) => setFilters((current) => ({ ...current, ...patch }));

  useEffect(() => {
    if (sentList.current) return;
    sentList.current = true;
    track("view_item_list", { items: products.map((product) => ({ itemId: product.id, itemName: product.name })) });
  }, [products]);

  function reset() {
    setFilters(initialFilters);
    setMinInput("");
    setMaxInput("");
  }

  return (
    <>
      <div className="sale-filters">
        <div className="sale-filters__bar">
          <label className="sale-filters__search">
            <span>Search products</span>
            <input type="search" value={filters.query} onChange={(event) => update({ query: event.target.value })} onKeyDown={(event) => { if (event.key === "Enter" && filters.query.trim()) track("search"); }} placeholder="Search by product name" />
          </label>
          <label className="sale-filters__sort">
            <span>Sort by</span>
            <select value={filters.sort} onChange={(event) => update({ sort: event.target.value as SaleSort })}>
              {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <button className="button button--outline sale-filters__toggle" type="button" aria-expanded={panelOpen} aria-controls={panelId} onClick={() => setPanelOpen((open) => !open)}>
            {panelOpen ? "Hide filters" : "Filters"}
          </button>
        </div>
        <fieldset className={`sale-filters__panel${panelOpen ? " is-open" : ""}`} id={panelId}>
          <legend className="visually-hidden">Filter products</legend>
          {fixedCollection ? null : (
            <label>
              <span>Collection</span>
              <select value={filters.collection} onChange={(event) => update({ collection: event.target.value })}>
                <option value="all">All collections</option>
                {collections.map((collection) => <option key={collection.slug} value={collection.slug}>{collection.title}</option>)}
              </select>
            </label>
          )}
          <div className="sale-filters__price" role="group" aria-labelledby={`${panelId}-price`}>
            <span id={`${panelId}-price`}>Price (₹)</span>
            <div>
              <label><span className="visually-hidden">Minimum price in rupees</span>
                <input type="number" inputMode="numeric" min={0} placeholder="Min" value={minInput} disabled={!anyPriced} onChange={(event) => { setMinInput(event.target.value); update({ minPrice: parseRupees(event.target.value) }); }} />
              </label>
              <label><span className="visually-hidden">Maximum price in rupees</span>
                <input type="number" inputMode="numeric" min={0} placeholder="Max" value={maxInput} disabled={!anyPriced} onChange={(event) => { setMaxInput(event.target.value); update({ maxPrice: parseRupees(event.target.value) }); }} />
              </label>
            </div>
          </div>
          <label>
            <span>Discount</span>
            <select value={filters.minDiscount} disabled={!discountOptions.length} onChange={(event) => update({ minDiscount: Number(event.target.value) })}>
              <option value={0}>{discountOptions.length ? "Any discount" : "No active discounts"}</option>
              {discountOptions.map((percent) => <option key={percent} value={percent}>{percent}% off or more</option>)}
            </select>
          </label>
          <label className="sale-filters__check">
            <input type="checkbox" checked={filters.inStockOnly} onChange={(event) => update({ inStockOnly: event.target.checked })} />
            <span>In stock only</span>
          </label>
          <button className="button button--outline" type="button" onClick={reset} disabled={!active}>Reset filters</button>
        </fieldset>
        {!anyVerified ? <p className="sale-filters__note">{anyPriced ? "Prices shown are illustrative development estimates. Discount and stock filters will work once verified prices and inventory are connected." : "Price, discount and stock filters will work once verified prices and inventory are connected."}</p> : null}
        {rangeInverted ? <p className="sale-filters__note" role="alert">The minimum price is higher than the maximum price.</p> : null}
      </div>
      <p className="sale-catalog__status" role="status" aria-live="polite">
        {!results.length ? "No products match these filters." : limited ? `Showing ${visible.length} of ${results.length} products.` : `Showing ${results.length} of ${products.length} products.`}
      </p>
      {results.length ? (
        <>
        <ul className="sale-product-grid" id={gridId} ref={gridRef} role="list" onClickCapture={(event) => {
          // Report product selections without a free-text search term.
          const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='/products/']");
          const product = link ? results.find((candidate) => candidate.href === link.getAttribute("href")) : undefined;
          if (product) track("select_item", { itemId: product.id, itemName: product.name });
        }}>
          {visible.map((product) => (
            <li key={product.id}><SaleProductCard product={product} collectionTitle={product.collectionSlug ? collectionTitles.get(product.collectionSlug) ?? null : null} /></li>
          ))}
        </ul>
        {limited || canCollapse ? (
          <div className="sale-catalog__more">
            <button className="button button--outline" type="button" aria-expanded={expanded} aria-controls={gridId} onClick={() => {
              setExpanded(!expanded);
              // When collapsing from far down the page, bring the shortened grid back into view.
              if (expanded) gridRef.current?.scrollIntoView({ block: "start" });
            }}>
              {limited ? `See more products (${results.length - visible.length} more)` : "Show fewer products"}
            </button>
          </div>
        ) : null}
        </>
      ) : (
        <div className="catalog-empty">
          <h3>No matching products</h3>
          <p>{filters.inStockOnly && !anyVerified ? "Stock information has not been connected yet, so no product can be confirmed as in stock." : "Try another name or remove a filter to see more products."}</p>
          <button className="button" type="button" onClick={reset}>Reset filters</button>
        </div>
      )}
    </>
  );
}
