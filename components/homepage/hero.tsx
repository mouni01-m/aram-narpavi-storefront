"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  href: string;
  cta: string;
  theme: string;
  shadeAlign?: "left" | "right";
};

const slides: Slide[] = [
  {
    eyebrow: "Aram Narpavi Herbals",
    title: "Nature's touch. A fresh start.",
    description: "Gentle, charcoal-infused herbal soap for a clean, refreshed feel.",
    image: "/images/banners/desktop-banner.webp",
    alt: "Aram Narpavi Charcoal Soap campaign — botanical herbal soap for daily care",
    href: "/products/charcoal-soap",
    cta: "Discover Charcoal Soap",
    theme: "charcoal-ad",
    shadeAlign: "left",
  },
  {
    eyebrow: "Goodness for everyday moments",
    title: "Goodness that brings us together.",
    description: "Explore Aram Narpavi Herbals ABC Malt — a traditional mix for the whole family.",
    image: "/images/banners/promotional-banner.webp",
    alt: "Indian family sharing ABC Malt drinks with an Aram Narpavi ABC Malt pouch",
    href: "/products/abc-malt",
    cta: "Discover ABC Malt",
    theme: "family-ad",
    shadeAlign: "left",
  },
  {
    eyebrow: "Heritage Sale · Limited time",
    title: "Heritage Sale. Natural favourites, thoughtfully priced.",
    description: "Explore selected herbal and pantry favourites during the Heritage Sale. Verified savings shown on eligible products.",
    image: "/images/banners/festival-banner.webp",
    alt: "Aram Narpavi Heritage Sale campaign with herbal products and festive styling",
    href: "/heritage-sale",
    cta: "Explore the Heritage Sale",
    theme: "heritage-sale",
    shadeAlign: "left",
  },
];

const AUTOPLAY_MS = 4000;

export function HomepageHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const move = useCallback((direction: number) => {
    setActive((current) => (current + direction + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
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

  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section
      className="home-hero campaign-carousel"
      aria-roledescription="carousel"
      aria-label="Aram Narpavi campaign highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false); }}
      onKeyDown={onKeyDown}
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
            <div className="campaign-slide__copy">
              <p className="eyebrow">{slide.eyebrow}</p>
              {index === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}
              <p className="campaign-slide__description">{slide.description}</p>
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
  );
}
