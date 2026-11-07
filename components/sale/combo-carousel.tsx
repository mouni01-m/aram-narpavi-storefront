"use client";

import { AnimatePresence, domAnimation, LazyMotion, m, MotionConfig, useReducedMotion } from "framer-motion";
import { useCallback, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AddPreviewBundleButton } from "@/components/cart/add-preview-bundle-button";
import { ProductPhoto } from "@/components/products/product-photo";
import { ComboModal } from "@/components/sale/combo-modal";
import { useDragScroll } from "@/components/ui/use-drag-scroll";
import { formatRupees, type Paise } from "@/lib/commerce/pricing";

export type ComboItemView = {
  id: string;
  name: string;
  href: string | null;
  quantity: number;
  linePrice: Paise | null;
  image: { src: string; alt: string; focus?: string } | null;
  note: string | null;
};

export type ComboView = {
  id: string;
  name: string;
  description: string;
  isEstimate: boolean;
  pricing: { referenceTotal: Paise; bundlePrice: Paise; savings: Paise; discountPercent: number } | null;
  items: readonly ComboItemView[];
};

const ease = [0.22, 1, 0.36, 1] as const;

const tileMotion = {
  hidden: { opacity: 0, y: 18 },
  visible: (index: number) => ({ opacity: 1, y: 0, boxShadow: "0px 0px 0px rgba(22, 61, 47, 0)", transition: { duration: 0.6, ease, delay: Math.min(index, 3) * 0.07 } }),
  lifted: { opacity: 1, y: -6, boxShadow: "0px 16px 32px rgba(22, 61, 47, 0.12)", transition: { duration: 0.45, ease } },
};
const mosaicMotion = { visible: { scale: 1, transition: { duration: 0.9, ease } }, lifted: { scale: 1.04, transition: { duration: 0.9, ease } } };

function Chevron({ direction }: { direction: "left" | "right" }) {
  return <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={direction === "left" ? "M10 3 5 8l5 5" : "m6 3 5 5-5 5"} /></svg>;
}

function ComboTile({ combo, index, onOpen }: { combo: ComboView; index: number; onOpen: () => void }) {
  const lift = useReducedMotion() ? undefined : "lifted";
  return (
    <m.article className="combo-tile" custom={index} variants={tileMotion} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} whileHover={lift}>
      <div className="combo-tile__media">
        <m.div className={`combo-tile__mosaic combo-tile__mosaic--${Math.min(combo.items.length, 5)}`} variants={mosaicMotion}>
          {combo.items.slice(0, 5).map((item) => <ProductPhoto key={item.id} image={item.image} name={item.name} sizes="(max-width: 700px) 42vw, 14vw" className="combo-tile__photo" />)}
        </m.div>
        {combo.pricing ? <span className="combo-tile__badge">Save {formatRupees(combo.pricing.savings)}</span> : null}
      </div>
      <div className="combo-tile__body">
        <p className="combo-tile__count">{combo.items.length} products</p>
        <h3><button className="combo-tile__open" type="button" aria-haspopup="dialog" onClick={onOpen}>{combo.name}</button></h3>
        <p className="combo-tile__description">{combo.description}</p>
        {combo.pricing ? (
          <p className="combo-tile__price">
            <span className="visually-hidden">Combo price </span><strong>{formatRupees(combo.pricing.bundlePrice)}</strong>
            <span className="visually-hidden">, bought separately </span><s>{formatRupees(combo.pricing.referenceTotal)}</s>
            <span className="combo-tile__off">{combo.pricing.discountPercent}% off</span>
          </p>
        ) : <p className="combo-tile__pending">Combo price awaiting approval</p>}
        <AddPreviewBundleButton bundleId={combo.id} bundleName={combo.name} label="Add to cart" className="combo-tile__action" />
      </div>
    </m.article>
  );
}

/** Native scrolling keeps touch swiping and keyboard focus reliable; mouse drag and arrows drive the same scroll position. */
export function ComboCarousel({ combos, fontClassName }: { combos: readonly ComboView[]; fontClassName: string }) {
  const { page, edges, visibleShare, thumbX, trackProps } = useDragScroll(".combo-tile");
  const canPortal = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeCombo = combos.find((combo) => combo.id === activeId) ?? null;

  const close = useCallback(() => setActiveId(null), []);
  const scrollable = visibleShare < 1;

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <div className="combo-carousel" role="group" aria-roledescription="carousel" aria-label="Curated combos">
          <div className="combo-carousel__track" {...trackProps}>
            {combos.map((combo, index) => <ComboTile key={combo.id} combo={combo} index={index} onOpen={() => setActiveId(combo.id)} />)}
          </div>
          {scrollable ? (
            <div className="combo-carousel__controls">
              <div className="combo-carousel__progress" aria-hidden="true">
                <m.span style={{ width: `${visibleShare * 100}%`, x: thumbX }} />
              </div>
              <button className="combo-carousel__arrow" type="button" onClick={() => page(-1)} disabled={edges.start} aria-label="Previous combos"><Chevron direction="left" /></button>
              <button className="combo-carousel__arrow" type="button" onClick={() => page(1)} disabled={edges.end} aria-label="Next combos"><Chevron direction="right" /></button>
            </div>
          ) : null}
        </div>
        {canPortal ? createPortal(<AnimatePresence>{activeCombo ? <ComboModal key={activeCombo.id} combo={activeCombo} fontClassName={fontClassName} onClose={close} /> : null}</AnimatePresence>, document.body) : null}
      </MotionConfig>
    </LazyMotion>
  );
}
