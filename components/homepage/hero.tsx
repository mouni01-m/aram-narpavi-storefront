"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { DiwaliCountdown } from "@/components/homepage/diwali-countdown";

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  href: string;
  cta: string;
  theme: string;
  copyClassName?: string;
  countdown?: boolean;
};

const CAMPAIGN_CREDIT = "Campaign artwork by Aram Narpavi Herbals";

const slides: Slide[] = [
  {
    eyebrow: "Aram Narpavi Herbals",
    title: "Nature's touch. A fresh start.",
    description: "Discover our Charcoal Soap.",
    image: "/images/home/campaigns/charcoal-soap-ad.png",
    alt: "Woman holding Aram Narpavi Charcoal Soap in a botanical setting",
    href: "/products/charcoal-soap",
    cta: "Discover Charcoal Soap",
    theme: "charcoal-ad",
  },
  {
    eyebrow: "Goodness for everyday moments",
    title: "Goodness that brings us together.",
    description: "Explore Aram Narpavi Herbals ABC Malt.",
    image: "/images/home/campaigns/abc-malt-family.png",
    alt: "Indian family sharing ABC Malt drinks with an Aram Narpavi ABC Malt pouch",
    href: "/products/abc-malt",
    cta: "Discover ABC Malt",
    theme: "family-ad",
  },
  {
    eyebrow: "Diwali Special · November 6, 2026",
    title: "Celebrate Diwali. Share natural goodness.",
    description: "Explore thoughtful herbal favourites for the festive season.",
    image: "/images/home/campaigns/diwali-goodness.png",
    alt: "Aram Narpavi Diwali campaign with ABC Malt, soap, herbal oils, and festive lamps",
    href: "/shop",
    cta: "Explore our products",
    theme: "countdown",
    copyClassName: "campaign-slide__copy--diwali",
    countdown: true,
  },
];

const AUTOPLAY_MS = 4000;
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
      <div className="campaign-carousel__slides" aria-live="off">
        {slides.map((slide, index) => (
          <article
            key={slide.theme}
            className={`campaign-slide campaign-slide--${slide.theme}${active === index ? " is-active" : ""}`}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
            aria-hidden={active !== index}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 700px) 100vw, 96vw"
              className="campaign-slide__image"
            />
            <div className="campaign-slide__shade" aria-hidden="true" />
            <div className={`campaign-slide__copy${slide.copyClassName ? ` ${slide.copyClassName}` : ""}`}>
              <div>
                <p className="eyebrow">{slide.eyebrow}</p>
                {index === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}
                <p className="campaign-slide__description">{slide.description}</p>
              </div>
              {slide.countdown ? <DiwaliCountdown /> : null}
              <Link className="button campaign-slide__cta" href={slide.href}>
                {slide.cta}<span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
      <button className="campaign-carousel__arrow campaign-carousel__arrow--prev" type="button" aria-label="Previous campaign" onClick={() => move(-1)}>‹</button>
      <button className="campaign-carousel__arrow campaign-carousel__arrow--next" type="button" aria-label="Next campaign" onClick={() => move(1)}>›</button>
      <div className="campaign-carousel__controls" aria-label="Choose campaign slide">
        {slides.map((slide, index) => (
          <button
            key={slide.theme}
            type="button"
            aria-label={`Show slide ${index + 1}: ${slide.title}`}
            aria-current={active === index ? "true" : undefined}
            onClick={() => setActive(index)}
          >
            <span />
          </button>
        ))}
      </div>
    </section>
    <p className="campaign-carousel__credit">{CAMPAIGN_CREDIT}</p>
    </>
  );
}
