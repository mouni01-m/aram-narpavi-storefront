"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { useId, useRef } from "react";
import { AddPreviewBundleButton } from "@/components/cart/add-preview-bundle-button";
import { ProductPhoto } from "@/components/products/product-photo";
import type { ComboView } from "@/components/sale/combo-carousel";
import { useModalDialog } from "@/components/ui/use-modal-dialog";
import { formatRupees } from "@/lib/commerce/pricing";

const ease = [0.22, 1, 0.36, 1] as const;

const listMotion = { hidden: {}, shown: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } } };
const itemMotion = { hidden: { opacity: 0, y: 14 }, shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } };

/** Centred combo details. Closes on the X, a click outside, or Escape, and returns focus to the card. */
export function ComboModal({ combo, fontClassName, onClose }: { combo: ComboView; fontClassName: string; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const onBackdropMouseDown = useModalDialog(panelRef, onClose);

  const { pricing } = combo;
  return (
    <m.div
      className={`combo-modal ${fontClassName}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onMouseDown={onBackdropMouseDown}
    >
      <m.div
        className="combo-modal__panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ duration: 0.4, ease }}
      >
        <button className="combo-modal__close" type="button" onClick={onClose} aria-label="Close combo details">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><path d="m3.5 3.5 9 9m0-9-9 9" /></svg>
        </button>
        <div className="combo-modal__scroll">
          <header className="combo-modal__header">
            <p className="combo-modal__count">{combo.items.length} products</p>
            <h2 id={titleId}>{combo.name}</h2>
            <p>{combo.description}</p>
          </header>
          <m.ul className={`combo-modal__items${combo.items.length === 1 ? " combo-modal__items--single" : ""}`} variants={listMotion} initial="hidden" animate="shown">
            {combo.items.map((item) => (
              <m.li className="combo-modal__item" key={item.id} variants={itemMotion}>
                <span className="combo-modal__photo"><ProductPhoto image={item.image} name={item.name} sizes="104px" /></span>
                <div className="combo-modal__info">
                  <h3>{item.href ? <Link href={item.href} onClick={onClose}>{item.name}</Link> : item.name}</h3>
                  {item.note ? <p>{item.note}</p> : null}
                  <span className="combo-modal__line">
                    <span>Qty {item.quantity}</span>
                    {item.linePrice !== null ? <strong>{formatRupees(item.linePrice)}</strong> : null}
                  </span>
                </div>
              </m.li>
            ))}
          </m.ul>
        </div>
        <footer className="combo-modal__footer">
          {pricing ? (
            <dl className="combo-modal__totals">
              <div><dt>Combo total</dt><dd><s>{formatRupees(pricing.referenceTotal)}</s></dd></div>
              <div className="combo-modal__final"><dt>Combo price</dt><dd>{formatRupees(pricing.bundlePrice)}</dd></div>
              <div className="combo-modal__saving"><dt>You save</dt><dd>{formatRupees(pricing.savings)} ({pricing.discountPercent}%)</dd></div>
            </dl>
          ) : <p className="combo-modal__pending">Combo price awaiting approval</p>}
          <AddPreviewBundleButton bundleId={combo.id} bundleName={combo.name} label="Add combo to cart" className="combo-modal__add" />
          {combo.isEstimate ? <p className="combo-modal__note">Prices shown are preview estimates until they are approved.</p> : null}
        </footer>
      </m.div>
    </m.div>
  );
}
