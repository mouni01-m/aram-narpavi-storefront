"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { DiwaliCountdown } from "@/components/homepage/diwali-countdown";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  href: string;
  cta: string;
  countdown?: boolean;
};

const CAMPAIGN_CREDIT = "Campaign artwork by Aram Narpavi Herbals";

const slides: Slide[] = [
  {
    id: "charcoal",
    eyebrow: "Aram Narpavi Herbals",
    title: "Deep cleansing for fresh, glowing skin.",
    description: "Discover our Charcoal Soap, hand made and inspired by nature.",
    image: "/images/products/soaps/charcoal-soap-glow.webp",
    width: 1900,
    height: 696,
    alt: "Woman washing her face with Aram Narpavi Charcoal Soap beside its box and lime slices",
    href: "/products/charcoal-soap",
    cta: "Discover Charcoal Soap",
  },
  {
    id: "family",
    eyebrow: "Goodness for everyday moments",
    title: "Goodness that brings us together.",
    description: "Explore Aram Narpavi Herbals ABC Malt.",
    image: "/images/home/campaigns/abc-malt-family.webp",
    width: 1672,
    height: 941,
    alt: "Indian family sharing ABC Malt drinks with an Aram Narpavi ABC Malt pouch",
    href: "/products/abc-malt",
    cta: "Discover ABC Malt",
  },
  {
    id: "diwali",
    eyebrow: "Diwali Special · November 6, 2026",
    title: "Celebrate Diwali. Share natural goodness.",
    description: "Explore thoughtful herbal favourites for the festive season.",
    image: "/images/home/campaigns/diwali-goodness.webp",
    width: 1916,
    height: 821,
    alt: "Aram Narpavi Diwali campaign with ABC Malt, soap, herbal oils, and festive lamps",
    href: "/shop",
    cta: "Explore our products",
    countdown: true,
  },
];

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD_PX = 40;

export function HomepageHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const swipeStartX = useRef<number | null>(null);

  const move = useCallback((direction: number) => {
    setActive((current) => (current + direction + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timerRef.current = setInterval(() => {
      if (!document.hidden) {
        setActive((current) => (current + 1) % slides.length);
      }
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
  };

  return (
    <>
    <section
      className="home-hero campaign-carousel"
      aria-roledescription="carousel"
      aria-label="Aram Narpavi campaign highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false); }}
      onKeyDown={onKeyDown}
      onTouchStart={(event) => { swipeStartX.current = event.touches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => {
        const start = swipeStartX.current;
        const end = event.changedTouches[0]?.clientX;
        swipeStartX.current = null;
        if (start === null || end === undefined) return;
        if (Math.abs(end - start) > SWIPE_THRESHOLD_PX) move(end < start ? 1 : -1);
      }}
    >
      <div className="campaign-carousel__slides">
        {slides.map((slide, index) => (
          <article
            key={slide.id}
            className={`campaign-slide${active === index ? " is-active" : ""}`}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
            aria-hidden={active !== index}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              width={slide.width}
              height={slide.height}
              priority={index === 0}
              sizes="(max-width: 700px) 100vw, 96vw"
              className="campaign-slide__image"
            />
            <div className="campaign-slide__caption">
              <div className="campaign-slide__text">
                <p className="eyebrow">{slide.eyebrow}</p>
                {index === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}
                <p className="campaign-slide__description">{slide.description}</p>
              </div>
              {slide.countdown ? <div className="campaign-slide__countdown"><DiwaliCountdown /></div> : null}
              <Link className="button campaign-slide__cta" href={slide.href} tabIndex={active === index ? 0 : -1}>
                {slide.cta}<span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="campaign-carousel__nav">
        <button className="campaign-carousel__arrow" type="button" aria-label="Previous campaign" onClick={() => move(-1)}>‹</button>
        <div className="campaign-carousel__controls" aria-label="Choose campaign slide">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show slide ${index + 1}: ${slide.title}`}
              aria-current={active === index ? "true" : undefined}
              onClick={() => setActive(index)}
            >
              <span />
            </button>
          ))}
        </div>
        <button className="campaign-carousel__arrow" type="button" aria-label="Next campaign" onClick={() => move(1)}>›</button>
      </div>
    </section>
    <p className="campaign-carousel__credit">{CAMPAIGN_CREDIT}</p>
    </>
  );
}
