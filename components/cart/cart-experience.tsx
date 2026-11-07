"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";

export function CartExperience() {
  const { state, itemCount, increase, decrease, remove, clear } = useCart();
  const distinctItemCount = state.items.length;

  return (
    <div className="cart-layout">
      <section className="cart-items-panel" aria-labelledby="cart-items-heading">
        <div className="cart-panel-heading">
          <div><p className="eyebrow">Local browser state</p><h2 id="cart-items-heading">Preview items</h2></div>
          {state.items.length ? <button className="cart-clear-button" type="button" onClick={clear}>Clear preview cart</button> : null}
        </div>
        {state.items.length ? (
          <ul className="cart-item-list">
            {state.items.map((item) => (
              <li className="cart-line-item" key={item.id}>
                {item.image ? (
                  <div className="cart-line-item__image"><Image src={item.image.src} alt={item.image.alt} fill sizes="96px" /></div>
                ) : (
                  <div className="cart-line-item__placeholder" role="img" aria-label={`Approved product photography for ${item.name} is pending`}><span aria-hidden="true">AN</span></div>
                )}
                <div className="cart-line-item__details">
                  <h3><Link href={item.href}>{item.name}</Link></h3>
                  {item.includes ? (
                    <ul className="cart-line-item__includes" aria-label={`${item.name} includes`}>
                      {item.includes.map((included) => <li key={included.name}>{included.quantity} × {included.name}</li>)}
                    </ul>
                  ) : null}
                  <p>Development preview · no price or availability</p>
                  <button className="cart-remove-button" type="button" onClick={() => remove(item.id)}>Remove {item.name}</button>
                </div>
                <div className="quantity-control" aria-label={`${item.name} quantity`}>
                  <button type="button" onClick={() => decrease(item.id)} disabled={item.quantity === 1} aria-label={`Decrease ${item.name} quantity; minimum is one`}>−</button>
                  <output aria-label={`${item.name} quantity is ${item.quantity}`}>{item.quantity}</output>
                  <button type="button" onClick={() => increase(item.id)} aria-label={`Increase ${item.name} quantity`}>+</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="cart-empty-state">
            <span className="cart-empty-state__mark" aria-hidden="true">0</span>
            <h3>Your preview cart is empty</h3>
            <p>This reflects only the current browser session. It does not describe real product availability or Shopify inventory.</p>
            <Link className="button" href="/shop">Continue browsing</Link>
          </div>
        )}
        {state.items.length ? <Link className="text-link cart-continue-link" href="/shop">← Continue browsing</Link> : null}
      </section>
      <aside className="cart-summary" aria-labelledby="cart-summary-heading">
        <p className="eyebrow">Non-financial summary</p>
        <h2 id="cart-summary-heading">Order preview</h2>
        <dl>
          <div><dt>Total preview units</dt><dd>{itemCount}</dd></div>
          <div><dt>Distinct preview items</dt><dd>{distinctItemCount}</dd></div>
          <div><dt>Pricing</dt><dd>Awaiting verified catalogue</dd></div>
        </dl>
        <p className="cart-checkout-reason" id="checkout-disabled-reason">Checkout will be enabled after verified product information, pricing, shipping and Shopify checkout are configured.</p>
        <button className="button cart-checkout-button" type="button" disabled aria-describedby="checkout-disabled-reason">Checkout unavailable</button>
        <p className="cart-session-note">This prototype is held in browser memory, resets on refresh and is not synchronized with Shopify.</p>
      </aside>
    </div>
  );
}
