"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, domAnimation, LazyMotion, m, MotionConfig } from "framer-motion";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/components/cart/cart-provider";
import { ProductPhoto } from "@/components/products/product-photo";
import { CartDrawer, type DrawerProduct } from "@/components/sale/cart-drawer";
import { OfferCountdown } from "@/components/sale/offer-countdown";
import { formatRupees, type Paise } from "@/lib/commerce/pricing";

export type NewArrivalItem = DrawerProduct & { linePrice: Paise | null; note: string | null; quantity: number; hotspot: { x: number; y: number } | null };

export type NewArrivalView = {
  id: string;
  title: string;
  description: string;
  endsAt: string;
  state: "live" | "expired" | "unpriced";
  isEstimate: boolean;
  pricing: { referenceTotal: Paise; bundlePrice: Paise; savings: Paise; discountPercent: number } | null;
  composition: { src: string; alt: string; width: number; height: number };
  items: readonly NewArrivalItem[];
  betterTogether: readonly DrawerProduct[];
};

const ease = [0.22, 1, 0.36, 1] as const;
const LOCK_RELEASE_MS = 350;
const listMotion = { hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const rowMotion = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };

function Hotspot({ item, open, onHover, onToggle, onClose }: { item: NewArrivalItem; open: boolean; onHover: (value: boolean) => void; onToggle: () => void; onClose: () => void }) {
  const { hotspot } = item;
  if (!hotspot) return null;
  return (
    <div className={`combo-hotspot${open ? " is-open" : ""}`} style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }} onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
      <m.button className="combo-hotspot__dot" type="button" aria-expanded={open} aria-label={`Show details for ${item.name}`} whileHover={{ scale: 1.14 }} whileTap={{ scale: 0.94 }} onClick={onToggle}>
        <span />
      </m.button>
      <AnimatePresence>
        {open ? (
          <m.div className={`combo-hotspot__tip combo-hotspot__tip--${hotspot.x > 55 ? "left" : "right"} combo-hotspot__tip--${hotspot.y < 35 ? "below" : "above"}`} initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.98 }} transition={{ duration: 0.22, ease }}>
            <Link href={item.href} onClick={onClose}>
              <span className="combo-hotspot__photo"><ProductPhoto image={item.image ? { ...item.image, alt: "" } : null} name={item.name} sizes="48px" /></span>
              <span className="combo-hotspot__text">
                <span>{item.name}</span>
                {item.linePrice !== null ? <strong>{formatRupees(item.linePrice)}</strong> : null}
              </span>
            </Link>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** One configurable featured combo: composition with hotspots, product list, pricing and cart drawer. */
export function NewArrivalCombo({ view, fontClassName }: { view: NewArrivalView; fontClassName: string }) {
  const { addPreviewBundle } = useCart();
  const canPortal = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const stageRef = useRef<HTMLDivElement>(null);
  const addLock = useRef(false);
  const [expired, setExpired] = useState(view.state === "expired");
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeHotspot = hovered ?? pinned;
  const live = view.state === "live" && !expired;

  const expire = useCallback(() => setExpired(true), []);
  // Stays locked until just after the drawer closes, so repeated clicks can never add the set twice.
  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    window.setTimeout(() => { addLock.current = false; }, LOCK_RELEASE_MS);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest(".combo-hotspot")) setPinned(null);
    };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setPinned(null); };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [pinned]);

  const addSet = () => {
    if (addLock.current) return;
    addLock.current = true;
    addPreviewBundle(view.id);
    setDrawerOpen(true);
  };

  const { pricing } = view;
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <m.header className="offer-header" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }}>
          <h2 id="new-arrival-heading">New Arrival Offer</h2>
          {live ? <OfferCountdown endsAt={view.endsAt} onExpire={expire} /> : null}
          {expired ? <p className="offer-header__ended" role="status">This offer has ended. You can still explore each product below.</p> : null}
          {view.state === "unpriced" ? <p className="offer-header__ended">Offer details are announced once prices are approved.</p> : null}
        </m.header>
        <div className="new-arrival">
          <m.div className="new-arrival__stage" ref={stageRef} initial={{ opacity: 0, scale: 1.04 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.1, ease }}>
            <m.div className="new-arrival__image" whileHover={{ scale: 1.015 }} transition={{ duration: 0.9, ease }}>
              <Image src={view.composition.src} alt={view.composition.alt} width={view.composition.width} height={view.composition.height} sizes="(max-width: 900px) 92vw, 46vw" />
            </m.div>
            {view.items.map((item) => (
              <Hotspot
                key={item.id}
                item={item}
                open={activeHotspot === item.id}
                onHover={(value) => setHovered(value ? item.id : null)}
                onToggle={() => setPinned((current) => (current === item.id ? null : item.id))}
                onClose={() => { setPinned(null); setHovered(null); }}
              />
            ))}
          </m.div>
          <div className="new-arrival__details">
            <h3>{view.title}</h3>
            <p className="new-arrival__description">{view.description}</p>
            <m.ul className="new-arrival__items" variants={listMotion} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
              {view.items.map((item) => (
                <m.li key={item.id} variants={rowMotion}>
                  <Link href={item.href} onMouseEnter={() => setHovered(item.id)} onMouseLeave={() => setHovered(null)}>
                    <span className="new-arrival__thumb"><ProductPhoto image={item.image ? { ...item.image, alt: "" } : null} name={item.name} sizes="72px" /></span>
                    <span className="new-arrival__item-text">
                      <span className="new-arrival__item-name">{item.name}</span>
                      {item.note ? <span className="new-arrival__item-note">{item.note}</span> : null}
                    </span>
                    {item.linePrice !== null ? <span className="new-arrival__item-price">{formatRupees(item.linePrice)}</span> : null}
                  </Link>
                </m.li>
              ))}
            </m.ul>
            {live && pricing ? (
              <>
                <dl className="new-arrival__totals">
                  <div><dt>Bought separately</dt><dd><s>{formatRupees(pricing.referenceTotal)}</s></dd></div>
                  <div className="new-arrival__final"><dt>Combo price</dt><dd>{formatRupees(pricing.bundlePrice)}</dd></div>
                  <div className="new-arrival__saving"><dt>You save</dt><dd>{formatRupees(pricing.savings)} ({pricing.discountPercent}%)</dd></div>
                </dl>
                <button className="button new-arrival__add" type="button" onClick={addSet} aria-label={`Add Set to Cart: ${view.title}, preview cart`}>Add Set to Cart</button>
                {view.isEstimate ? <p className="new-arrival__note">Prices shown are preview estimates until they are approved.</p> : null}
              </>
            ) : expired && pricing ? (
              <p className="new-arrival__ended-total">Total when bought separately: <strong>{formatRupees(pricing.referenceTotal)}</strong></p>
            ) : view.state === "unpriced" ? (
              <p className="new-arrival__ended-total">Combo price awaiting approval</p>
            ) : null}
          </div>
        </div>
        {canPortal ? createPortal(<AnimatePresence>{drawerOpen ? <CartDrawer betterTogether={view.betterTogether} fontClassName={fontClassName} onClose={closeDrawer} /> : null}</AnimatePresence>, document.body) : null}
      </MotionConfig>
    </LazyMotion>
  );
}
