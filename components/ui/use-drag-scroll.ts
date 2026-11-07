"use client";

import { animate, useMotionValue, useReducedMotion, useTransform, type AnimationPlaybackControls } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent, type DragEvent as ReactDragEvent } from "react";

const DRAG_THRESHOLD = 6;
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Horizontal carousel on native scrolling, which keeps touch swiping and keyboard focus
 * reliable. Mouse dragging and arrows drive the same scroll position. The track needs
 * `is-dragging` and `is-gliding` styles that turn scroll snapping off.
 */
export function useDragScroll(itemSelector: string) {
  const trackRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<AnimationPlaybackControls | null>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startLeft: number; moved: boolean; lastX: number; lastTime: number; velocity: number } | null>(null);
  const suppressClick = useRef(false);
  const reduced = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: false });
  const [visibleShare, setVisibleShare] = useState(0.5);
  const progress = useMotionValue(0);
  const thumbX = useTransform(progress, (value) => `${value * (100 / visibleShare - 100)}%`);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    progress.set(max > 0 ? track.scrollLeft / max : 0);
    setEdges({ start: track.scrollLeft <= 2, end: track.scrollLeft >= max - 2 });
    setVisibleShare(track.scrollWidth ? Math.min(1, track.clientWidth / track.scrollWidth) : 1);
  }, [progress]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(sync);
    observer.observe(track);
    return () => {
      observer.disconnect();
      motionRef.current?.stop();
    };
  }, [sync]);

  const cardOffsets = () => {
    const track = trackRef.current;
    if (!track) return [];
    const cards = [...track.querySelectorAll<HTMLElement>(itemSelector)];
    const first = cards[0]?.offsetLeft ?? 0;
    return cards.map((card) => card.offsetLeft - first);
  };

  const glideTo = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const left = Math.max(0, Math.min(target, track.scrollWidth - track.clientWidth));
    motionRef.current?.stop();
    if (reduced) {
      track.scrollLeft = left;
      return;
    }
    // Snapping would fight each animated frame, so it stays off until the glide ends.
    track.classList.add("is-gliding");
    motionRef.current = animate(track.scrollLeft, left, {
      duration: 0.55,
      ease,
      onUpdate: (value) => { track.scrollLeft = value; },
      onComplete: () => track.classList.remove("is-gliding"),
    });
  };

  const page = (direction: 1 | -1) => {
    const track = trackRef.current;
    const offsets = cardOffsets();
    if (!track || offsets.length < 2) return;
    const step = offsets[1] - offsets[0];
    const perView = Math.max(1, Math.floor((track.clientWidth + 1) / step));
    const current = Math.round(track.scrollLeft / step);
    glideTo(offsets[Math.max(0, Math.min(current + direction * perView, offsets.length - 1))]);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    suppressClick.current = false;
    // Touch and pen already scroll natively.
    if (event.pointerType !== "mouse" || event.button !== 0 || !trackRef.current) return;
    motionRef.current?.stop();
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startLeft: trackRef.current.scrollLeft, moved: false, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0 };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track || event.pointerId !== drag.pointerId) return;
    const distance = event.clientX - drag.startX;
    if (!drag.moved) {
      if (Math.abs(distance) < DRAG_THRESHOLD) return;
      drag.moved = true;
      // Captured only once dragging, so a plain click still reaches the card or its button.
      track.setPointerCapture(event.pointerId);
      track.classList.add("is-dragging");
    }
    const elapsed = event.timeStamp - drag.lastTime;
    if (elapsed > 0) drag.velocity = (event.clientX - drag.lastX) / elapsed;
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
    track.scrollLeft = drag.startLeft - distance;
  };

  const endDrag = () => {
    const drag = dragRef.current;
    const track = trackRef.current;
    dragRef.current = null;
    if (!drag?.moved || !track) return;
    suppressClick.current = true;
    track.classList.remove("is-dragging");
    const projected = track.scrollLeft - drag.velocity * 180;
    const offsets = cardOffsets();
    glideTo(offsets.reduce((best, offset) => Math.abs(offset - projected) < Math.abs(best - projected) ? offset : best, offsets[0] ?? 0));
  };

  return {
    page,
    edges,
    visibleShare,
    thumbX,
    trackProps: {
      ref: trackRef,
      onScroll: sync,
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onDragStart: (event: ReactDragEvent<HTMLDivElement>) => event.preventDefault(),
      onClickCapture: (event: ReactMouseEvent<HTMLDivElement>) => {
        if (!suppressClick.current) return;
        suppressClick.current = false;
        event.preventDefault();
        event.stopPropagation();
      },
    },
  };
}
