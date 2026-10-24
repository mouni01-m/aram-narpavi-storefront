"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import type { PreviewProduct } from "@/lib/content/catalog-preview";

type CategoryOption = { slug: string; title: string };

export function CatalogBrowser({ products, categories, fixedCategory }: {
  products: readonly PreviewProduct[];
  categories: readonly CategoryOption[];
  fixedCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(fixedCategory ?? "all");
  const [sort, setSort] = useState("name-asc");
  const sentList = useRef(false);
  const filtered = useMemo(() => products
    .filter((product) => !query.trim() || product.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
    .filter((product) => category === "all" || product.collectionSlug === category)
    .slice().sort((a, b) => sort === "name-desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)),
  [products, query, category, sort]);
  const hasFilters = query.length > 0 || (!fixedCategory && category !== "all") || sort !== "name-asc";
  useEffect(() => {
    if (sentList.current) return;
    sentList.current = true;
    window.dispatchEvent(new CustomEvent("storefront-analytics", {
      detail: { name: "view_item_list", items: products.map((product) => ({ itemId: product.routeKey, itemName: product.name })) },
    }));
  }, [products]);
  function track(name: "search" | "select_item", item?: { itemId: string; itemName: string }) {
    window.dispatchEvent(new CustomEvent("storefront-analytics", { detail: { name, ...item } }));
  }

  function reset() {
    setQuery("");
    setCategory(fixedCategory ?? "all");
    setSort("name-asc");
  }

  return (
    <>
      <div className="catalog-controls" aria-label="Preview catalogue controls">
        <label>Search by product name
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && query.trim()) track("search"); }} placeholder="Search preview names" />
        </label>
        {!fixedCategory && <label>Draft category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All draft groupings</option>
            {categories.map((item) => <option key={item.slug} value={item.slug}>{item.title} · draft</option>)}
          </select>
        </label>}
        <label>Sort by
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="name-asc">Name, A to Z</option>
            <option value="name-desc">Name, Z to A</option>
          </select>
        </label>
        <button className="button button--outline" type="button" onClick={reset} disabled={!hasFilters}>Reset</button>
      </div>
      <p className="catalog-status" aria-live="polite">{filtered.length ? `Showing ${filtered.length} matching preview ${filtered.length === 1 ? "name" : "names"}.` : "No preview names match these filters."}</p>
      {filtered.length ? <div className="product-preview-grid catalog-grid" onClickCapture={(event) => {
        const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='/products/']");
        const productId = link?.getAttribute("href")?.split("/").at(-1);
        const productName = link?.closest("article")?.querySelector("h3")?.textContent?.trim();
        if (productId && productName) track("select_item", { itemId: productId, itemName: productName });
      }}>{filtered.map((product, index) => <ProductCard key={product.name} product={product} index={index} />)}</div> : (
        <div className="catalog-empty"><h2>{query ? "No matching preview names" : "No products in this draft collection"}</h2><p>{query ? "Try another name or reset the filters to see the preview names again." : "Product membership has not been verified, so no products are assigned to this preview."}</p><button className="button" type="button" onClick={reset}>Reset filters</button></div>
      )}
    </>
  );
}
