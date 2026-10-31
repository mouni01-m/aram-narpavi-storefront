"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { heritageSale } from "@/lib/content/heritage-sale";

function readShownFlag() {
  try {
    return window.sessionStorage.getItem(heritageSale.sessionKey) === "shown";
  } catch {
    return false;
  }
}

function writeShownFlag() {
  try {
    window.sessionStorage.setItem(heritageSale.sessionKey, "shown");
  } catch {
    // The popup still closes normally when session storage is unavailable.
  }
}

export function HeritageSalePopup() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heritageSale.enabled || readShownFlag()) return;
    const timer = window.setTimeout(() => {
      writeShownFlag();
      setOpen(true);
    }, heritageSale.openDelayMs);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    panel?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="heritage-popup" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div
        className="heritage-popup__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="heritage-popup-title"
        aria-describedby="heritage-popup-offer"
        tabIndex={-1}
        ref={panelRef}
      >
        <button className="heritage-popup__close" type="button" aria-label="Close Heritage Sale offer" onClick={() => setOpen(false)}>
          <span aria-hidden="true">×</span>
        </button>
        <div className="heritage-popup__media">
          <Image src={heritageSale.image.src} alt={heritageSale.image.alt} fill sizes="(max-width: 640px) 100vw, 23rem" />
        </div>
        <div className="heritage-popup__body">
          <p className="eyebrow">{heritageSale.eyebrow}</p>
          <h2 className="heritage-popup__title" id="heritage-popup-title">{heritageSale.title}</h2>
          <p className="heritage-popup__text">{heritageSale.description}</p>
          <p className="heritage-popup__offer" id="heritage-popup-offer">{heritageSale.offerText ?? heritageSale.placeholderOfferText}</p>
          <div className="heritage-popup__actions">
            <Link className="button" href={heritageSale.ctaHref} onClick={() => setOpen(false)}>
              {heritageSale.ctaLabel} <span aria-hidden="true">→</span>
            </Link>
            <button className="button button--outline" type="button" onClick={() => setOpen(false)}>Maybe later</button>
          </div>
        </div>
      </div>
    </div>
  );
}
