"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { ProductPhoto } from "@/components/products/product-photo";
import { useModalDialog } from "@/components/ui/use-modal-dialog";
import { getCartTotal, type CartPrices } from "@/lib/commerce/cart-pricing";
import { formatRupees, type Paise } from "@/lib/commerce/pricing";

export type DrawerProduct = {
  id: string;
  name: string;
  href: string;
  image: { src: string; alt: string; focus?: string } | null;
  price: Paise | null;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function CartDrawer({ betterTogether, fontClassName, onClose }: { betterTogether: readonly DrawerProduct[]; fontClassName: string; onClose: () => void }) {
  const { state, addPreviewItem } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [pricing, setPricing] = useState<CartPrices | null>(null);
  const onBackdropMouseDown = useModalDialog(panelRef, onClose);

  // Always fresh: prices can change when an offer ends.
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/cart-prices", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() as Promise<CartPrices> : null))
      .then((data) => { if (data) setPricing(data); })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const inCart = new Set(state.items.map((item) => item.id));
  const suggestions = betterTogether.filter((product) => !inCart.has(product.id));
  const total = pricing ? getCartTotal(state.items, pricing.prices) : null;

  return (
    <m.div className={`cart-drawer ${fontClassName}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onMouseDown={onBackdropMouseDown}>
      <m.div className="cart-drawer__panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.42, ease }}>
        <header className="cart-drawer__header">
          <h2 id={titleId}>Added to your cart</h2>
          <button className="cart-drawer__close" type="button" onClick={onClose} aria-label="Close cart">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><path d="m3.5 3.5 9 9m0-9-9 9" /></svg>
          </button>
        </header>
        <div className="cart-drawer__scroll">
          <ul className="cart-drawer__lines">
            {state.items.map((item) => {
              const price = pricing?.prices[item.id];
              return (
                <li key={item.id}>
                  <span className="cart-drawer__line-name">{item.name}</span>
                  {item.includes ? <span className="cart-drawer__line-detail">{item.includes.map((included) => included.name).join(", ")}</span> : null}
                  <span className="cart-drawer__line-meta">
                    <span>Qty {item.quantity}</span>
                    {price !== undefined ? <strong>{formatRupees(price * item.quantity)}</strong> : null}
                  </span>
                </li>
              );
            })}
          </ul>
          {suggestions.length ? (
            <section className="cart-drawer__together" aria-labelledby={`${titleId}-together`}>
              <h3 id={`${titleId}-together`}>Better Together</h3>
              <ul>
                {suggestions.map((product) => (
                  <li key={product.id}>
                    <span className="cart-drawer__photo"><ProductPhoto image={product.image ? { ...product.image, alt: "" } : null} name={product.name} sizes="56px" /></span>
                    <span className="cart-drawer__together-text">
                      <Link href={product.href} onClick={onClose}>{product.name}</Link>
                      {product.price !== null ? <span>{formatRupees(product.price)}</span> : null}
                    </span>
                    <button type="button" onClick={() => addPreviewItem(product.id)} aria-label={`Add ${product.name} to preview cart`}>Add</button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
        <footer className="cart-drawer__footer">
          <div className="cart-drawer__total" role="status">
            <span>{pricing?.isEstimate ? "Estimated preview total" : "Cart total"}</span>
            <strong>{total !== null ? formatRupees(total) : "Awaiting verified prices"}</strong>
          </div>
          {pricing?.isEstimate ? <p className="cart-drawer__note">Preview estimates only. Checkout is not available yet.</p> : null}
          <button className="button cart-drawer__continue" type="button" onClick={onClose}>Continue Shopping</button>
          <Link className="text-link cart-drawer__view" href="/cart" onClick={onClose}>View cart</Link>
        </footer>
      </m.div>
    </m.div>
  );
}
