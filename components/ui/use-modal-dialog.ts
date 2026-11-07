"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

/** The second click of a double-click lands on the backdrop, and must not close what just opened. */
const OUTSIDE_CLICK_DELAY_MS = 450;

/**
 * Locks page scrolling, moves focus in, traps Tab, closes on Escape, and returns focus on close.
 * Returns a backdrop mouse-down handler that closes on a click outside the panel.
 */
export function useModalDialog(panelRef: RefObject<HTMLElement | null>, onClose: () => void) {
  const openedAt = useRef(0);

  useEffect(() => {
    openedAt.current = performance.now();
    const panel = panelRef.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = document.documentElement;
    const { overflow } = root.style;
    const { paddingRight } = document.body.style;
    // Reserve the scrollbar's width so the page behind does not shift.
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    panel?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = [...panel.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      opener?.focus({ preventScroll: true });
    };
  }, [panelRef, onClose]);

  return useCallback((event: { target: EventTarget; currentTarget: EventTarget }) => {
    if (event.target === event.currentTarget && performance.now() - openedAt.current >= OUTSIDE_CLICK_DELAY_MS) onClose();
  }, [onClose]);
}
