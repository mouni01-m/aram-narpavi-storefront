"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, domAnimation, LazyMotion, m, MotionConfig, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Second line of copy, set apart from the description. */
  status?: string;
  image: string;
  alt: string;
  href: string;
  cta: string;
  /** Text and button colours: `light` is for pale backdrops. */
  tone: "dark" | "light";
  layout: "left" | "center";
};

const slides: readonly Slide[] = [
  {
    id: "diwali",
    eyebrow: "Diwali Special · November 6, 2026",
    title: "Celebrate Diwali. Share natural goodness.",
    description: "Explore thoughtful herbal favourites for the festive season.",
    status: "The campaign has begun. Browse the collection.",
    image: "/images/home/hero/diwali-banner.webp",
    alt: "Aram Narpavi ABC Malt, Charcoal Soap and herbal oils among festive lamps and fireworks",
    href: "/shop",
    cta: "Explore our products",
    tone: "dark",
    layout: "left",
  },
  {
    id: "skincare",
    eyebrow: "Herbal Skincare",
    title: "Discover the power of natural ingredients.",
    description: "Discover our Charcoal Soap.",
    image: "/images/home/hero/skincare-banner.webp",
    alt: "Woman holding Aram Narpavi Charcoal Soap in a botanical setting",
    href: "/products/charcoal-soap",
    cta: "Discover Charcoal Soap",
    tone: "dark",
    layout: "left",
  },
  {
    id: "nutrition",
    eyebrow: "Traditional Nutrition",
    title: "Everyday nutrition, rooted in tradition.",
    description: "Explore Aram Narpavi Herbals ABC Malt.",
    image: "/images/home/hero/nutrition-banner.webp",
    alt: "Indian family sharing ABC Malt drinks with an Aram Narpavi ABC Malt pouch",
    href: "/products/abc-malt",
    cta: "Discover ABC Malt",
    tone: "dark",
    layout: "left",
  },
  {
    id: "hair",
    eyebrow: "Hair Care",
    title: "Care for your hair, the traditional way.",
    description: "Explore Aram Narpavi Herbals Coconut Oil.",
    image: "/images/home/hero/coconut-oil-banner.webp",
    alt: "Aram Narpavi Coconut Oil bottle on a sunlit table with botanicals",
    href: "/products/coconut-oil",
    cta: "Discover Coconut Oil",
    tone: "light",
    layout: "left",
  },
  {
    id: "heritage",
    eyebrow: "The Heritage Sale",
    title: "Explore exclusive herbal offers.",
    description: "Sale preview. Offer prices are announced once approved.",
    image: "/images/home/hero/heritage-banner.webp",
    alt: "Aram Narpavi Desi Ghee, Honey and Gulkand jars on a sunlit table",
    href: "/sale-products",
    cta: "Preview the Heritage Sale",
    tone: "light",
    layout: "center",
  },
];

const AUTOPLAY_MS = 5500;
const SWIPE_DISTANCE = 45;
const ease = [0.22, 1, 0.36, 1] as const;

const slideMotion = {
  enter: (direction: number) => ({ x: `${direction * 100}%` }),
  center: { x: "0%", transition: { duration: 0.85, ease } },
  exit: (direction: number) => ({ x: `${direction * -100}%`, transition: { duration: 0.85, ease } }),
};
// The image travels less than its slide, which gives the gentle parallax.
const parallaxMotion = {
  enter: (direction: number) => ({ x: `${direction * -14}%` }),
  center: { x: "0%", transition: { duration: 0.85, ease } },
  exit: (direction: number) => ({ x: `${direction * 14}%`, transition: { duration: 0.85, ease } }),
};
const copyMotion = {
  enter: {},
  center: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } },
  exit: {},
};
const copyItemMotion = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export function HomepageHero() {
  const reduced = useReducedMotion();
  const [slide, setSlide] = useState({ index: 0, direction: 1 });
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [preload, setPreload] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const move = useCallback((direction: 1 | -1) => {
    setSlide((current) => ({ index: (current.index + direction + slides.length) % slides.length, direction }));
  }, []);

  const jump = (index: number) => {
    setSlide((current) => (index === current.index ? current : { index, direction: index > current.index ? 1 : -1 }));
  };

  // Waits until the first image has had its turn, so preloading never competes with it.
  useEffect(() => {
    const timer = window.setTimeout(() => setPreload(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (reduced || hovering || focused || stopped) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) move(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [reduced, hovering, focused, stopped, slide.index, move]);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
  };

  const onTouchStart = (event: TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const start = touchStart.current;
    const touch = event.changedTouches[0];
    touchStart.current = null;
    if (!start || !touch) return;
    const distance = touch.clientX - start.x;
    // Mostly vertical movement is the page scrolling, not a swipe.
    if (Math.abs(distance) >= SWIPE_DISTANCE && Math.abs(distance) > Math.abs(touch.clientY - start.y)) move(distance < 0 ? 1 : -1);
  };

  const current = slides[slide.index];
  const neighbours = [slides[(slide.index + 1) % slides.length], slides[(slide.index - 1 + slides.length) % slides.length]];

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <section
          className="hero-banner"
          aria-roledescription="carousel"
          aria-label="Aram Narpavi campaign highlights"
          onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovering(true); }}
          onPointerLeave={(event) => { if (event.pointerType === "mouse") setHovering(false); }}
          onFocusCapture={(event) => { if (event.target.matches(":focus-visible")) setFocused(true); }}
          onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <h1 className="visually-hidden">Aram Narpavi Herbals</h1>
          {preload ? (
            <div className="hero-banner__preload" aria-hidden="true">
              {neighbours.map((item) => <Image key={item.id} src={item.image} alt="" fill sizes="100vw" loading="eager" />)}
            </div>
          ) : null}
          <div className="hero-banner__slides">
            <AnimatePresence initial={false} custom={slide.direction}>
              <m.article
                key={current.id}
                className={`hero-slide hero-slide--${current.id} hero-slide--${current.layout} hero-slide--${current.tone}`}
                aria-roledescription="slide"
                aria-label={`${slide.index + 1} of ${slides.length}`}
                custom={slide.direction}
                variants={slideMotion}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <m.div className="hero-slide__parallax" custom={slide.direction} variants={parallaxMotion}>
                  <m.div className="hero-slide__zoom" initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 7, ease: "easeOut" }}>
                    <Image src={current.image} alt={current.alt} fill priority={slide.index === 0} sizes="100vw" />
                  </m.div>
                </m.div>
                <div className="hero-slide__shade" aria-hidden="true" />
                <div className="hero-slide__inner">
                  <m.div className="hero-slide__copy" variants={copyMotion}>
                    <m.p className="hero-slide__eyebrow" variants={copyItemMotion}>{current.eyebrow}</m.p>
                    <m.h2 variants={copyItemMotion}>{current.title}</m.h2>
                    <m.p className="hero-slide__description" variants={copyItemMotion}>{current.description}</m.p>
                    {current.status ? <m.p className="hero-slide__status" variants={copyItemMotion}>{current.status}</m.p> : null}
                    <m.div variants={copyItemMotion}>
                      <Link className="button hero-slide__cta" href={current.href}>{current.cta}<span aria-hidden="true">→</span></Link>
                    </m.div>
                  </m.div>
                </div>
              </m.article>
            </AnimatePresence>
          </div>
          <button className="hero-banner__arrow hero-banner__arrow--prev" type="button" aria-label="Previous campaign" onClick={() => move(-1)}>
            <svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
          </button>
          <button className="hero-banner__arrow hero-banner__arrow--next" type="button" aria-label="Next campaign" onClick={() => move(1)}>
            <svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
          </button>
          <div className="hero-banner__controls">
            <div className="hero-banner__dots" role="group" aria-label="Choose campaign slide">
              {slides.map((item, index) => <button key={item.id} type="button" aria-label={`Show slide ${index + 1}: ${item.title}`} aria-current={slide.index === index ? "true" : undefined} onClick={() => jump(index)}><span /></button>)}
            </div>
            <button className="hero-banner__toggle" type="button" onClick={() => setStopped((value) => !value)} aria-label={stopped ? "Play campaign rotation" : "Pause campaign rotation"}>
              <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor" aria-hidden="true">{stopped ? <path d="M4 2.5v11l9-5.5z" /> : <path d="M4 2.5h3v11H4zm5 0h3v11H9z" />}</svg>
            </button>
          </div>
          <svg className="hero-banner__wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 34c150 22 300 26 468 12C640 32 760 6 930 8c170 2 330 30 510 18v34H0z" /></svg>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
