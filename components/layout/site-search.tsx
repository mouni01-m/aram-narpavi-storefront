"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, LazyMotion, m, MotionConfig, useReducedMotion } from "framer-motion";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ProductPhoto } from "@/components/products/product-photo";
import { formatRupees, type ProductOffer } from "@/lib/commerce/pricing";
import { highlightMatches, searchProducts, type SearchableProduct } from "@/lib/commerce/product-search";
import { searchSuggestions } from "@/lib/content/sale";

const ease = [0.22, 1, 0.36, 1] as const;
const ROTATE_MS = 2800;
const loadFeatures = () => import("@/components/layout/motion-features").then((module) => module.default);

function track(name: "search" | "select_item", detail: Record<string, unknown> = {}) {
  window.dispatchEvent(new CustomEvent("storefront-analytics", { detail: { name, ...detail } }));
}

function priceLabel(offer: ProductOffer) {
  if (offer.kind === "priced") return formatRupees(offer.finalPrice);
  return offer.kind === "provisional" ? formatRupees(offer.price) : "Price awaiting verification";
}

function Highlighted({ text, query }: { text: string; query: string }) {
  return <>{highlightMatches(text, query).map((part, index) => part.match ? <mark key={index}>{part.text}</mark> : <span key={index}>{part.text}</span>)}</>;
}

/** Sits behind an empty field. It is decorative, so the input's own label names the field. */
function AnimatedPlaceholder() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % searchSuggestions.length), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [reduced]);

  return (
    <span className="site-search__placeholder" aria-hidden="true">
      <span>Search for&nbsp;</span>
      <span className="site-search__term">
        <AnimatePresence mode="wait" initial={false}>
          <m.span key={searchSuggestions[index]} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease }}>
            {searchSuggestions[index]}
          </m.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

export function SiteSearch() {
  const router = useRouter();
  const ids = useId();
  const rootRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const loadRef = useRef(false);
  const [index, setIndex] = useState<readonly SearchableProduct[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const hasQuery = query.trim().length > 0;
  const results = useMemo(() => (index && hasQuery ? searchProducts(index, query) : []), [index, query, hasQuery]);
  const showPanel = open && hasQuery;
  const listId = `${ids}-results`;
  const optionId = (position: number) => `${ids}-option-${position}`;

  const loadIndex = () => {
    if (index || loadRef.current) return;
    loadRef.current = true;
    setFailed(false);
    fetch("/api/product-search")
      .then((response) => {
        if (!response.ok) throw new Error(`Search data returned ${response.status}`);
        return response.json() as Promise<{ products: SearchableProduct[] }>;
      })
      .then((data) => setIndex(data.products))
      .catch(() => setFailed(true))
      .finally(() => { loadRef.current = false; });
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (active >= 0) listRef.current?.querySelector(`[id="${optionId(active)}"]`)?.scrollIntoView({ block: "nearest" });
    // optionId only depends on the stable generated id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const finish = (product: SearchableProduct) => {
    track("select_item", { itemId: product.id, itemName: product.name });
    setQuery("");
    setActive(-1);
    setOpen(false);
    inputRef.current?.blur();
  };

  const openProduct = (product: SearchableProduct) => {
    finish(product);
    router.push(product.href);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      if (showPanel) event.stopPropagation();
      setOpen(false);
      setActive(-1);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!hasQuery) return;
      event.preventDefault();
      setOpen(true);
      if (!results.length) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((value) => (value === -1 && step === -1 ? results.length - 1 : (value + step + results.length) % results.length));
    }
  };

  const hasEstimates = results.some((product) => product.offer.kind === "provisional");

  return (
    <LazyMotion features={loadFeatures}>
      <MotionConfig reducedMotion="user">
        <form
          ref={rootRef}
          className="site-search"
          role="search"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            if (!hasQuery) return;
            track("search");
            const target = results[active] ?? results[0];
            if (target) openProduct(target);
            else setOpen(true);
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
          }}
        >
          <div className="site-search__field">
            <svg className="site-search__icon" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="7" cy="7" r="4.75" /><path d="m10.6 10.6 3.4 3.4" /></svg>
            <input
              ref={inputRef}
              type="text"
              inputMode="search"
              enterKeyHint="search"
              role="combobox"
              aria-label="Search products"
              aria-expanded={showPanel && results.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={showPanel && active >= 0 ? optionId(active) : undefined}
              value={query}
              onFocus={() => {
                loadIndex();
                if (hasQuery) setOpen(true);
              }}
              onChange={(event) => {
                loadIndex();
                setQuery(event.target.value);
                setActive(-1);
                setOpen(true);
              }}
              onKeyDown={onKeyDown}
            />
            {query ? null : <AnimatedPlaceholder />}
            {query ? (
              <button
                className="site-search__clear"
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  setActive(-1);
                  setOpen(false);
                  inputRef.current?.focus();
                }}
              >
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m3.5 3.5 9 9m0-9-9 9" /></svg>
              </button>
            ) : null}
          </div>
          <p className="visually-hidden" role="status">{showPanel && index ? (results.length ? `${results.length} ${results.length === 1 ? "product" : "products"} found` : "No products found") : ""}</p>
          <AnimatePresence>
            {showPanel ? (
              <m.div className="site-search__panel" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.22, ease }}>
                {results.length ? (
                  <ul ref={listRef} className="site-search__results" id={listId} role="listbox" aria-label="Matching products">
                    {results.map((product, position) => (
                      <m.li key={product.id} role="presentation" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease, delay: Math.min(position, 5) * 0.03 }}>
                        <m.div whileHover={{ x: 3 }} transition={{ duration: 0.25, ease }}>
                          <Link
                            className={`site-search__result${position === active ? " is-active" : ""}`}
                            id={optionId(position)}
                            href={product.href}
                            role="option"
                            aria-selected={position === active}
                            tabIndex={-1}
                            // Keep focus in the input until the click lands, so the panel stays open.
                            onMouseDown={(event) => event.preventDefault()}
                            onMouseEnter={() => setActive(position)}
                            onClick={() => finish(product)}
                          >
                            <span className="site-search__photo"><ProductPhoto image={product.image ? { ...product.image, alt: "" } : null} name={product.name} sizes="56px" /></span>
                            <span className="site-search__text">
                              <span className="site-search__name"><Highlighted text={product.name} query={query} /></span>
                              {product.description ? <span className="site-search__description"><Highlighted text={product.description} query={query} /></span> : null}
                            </span>
                            <span className="site-search__price">{priceLabel(product.offer)}</span>
                          </Link>
                        </m.div>
                      </m.li>
                    ))}
                  </ul>
                ) : (
                  <div className="site-search__message">
                    {failed ? (
                      <p>Search is unavailable right now. Please try again.</p>
                    ) : index ? (
                      <>
                        <p><strong>No products found</strong></p>
                        <p>Try a product name, or <Link href="/shop" onClick={() => setOpen(false)}>browse all products</Link>.</p>
                      </>
                    ) : <p>Searching…</p>}
                  </div>
                )}
                {hasEstimates ? <p className="site-search__note">Prices shown are preview estimates until they are approved.</p> : null}
              </m.div>
            ) : null}
          </AnimatePresence>
        </form>
      </MotionConfig>
    </LazyMotion>
  );
}
