"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const slides = [
  {
    eyebrow: "Aram Narpavi Herbals",
    title: "Nature’s touch. A fresh start.",
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
  },
];

const campaignStart = Date.UTC(2026, 10, 5, 18, 30, 0); // November 6 at 00:00 IST
type Countdown = { days: number; hours: number; minutes: number; seconds: number; launched: boolean };

function getCountdown(now: number): Countdown {
  const remaining = Math.max(0, campaignStart - now);
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining % 86_400_000) / 3_600_000),
    minutes: Math.floor((remaining % 3_600_000) / 60_000),
    seconds: Math.floor((remaining % 60_000) / 1000),
    launched: now >= campaignStart,
  };
}

export function HomepageHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const region = useRef<HTMLElement>(null);
  const move = useCallback((direction: number) => setActive((current) => (current + direction + slides.length) % slides.length), []);

  useEffect(() => {
    const tick = () => setCountdown(getCountdown(Date.now()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
  };

  return (
    <section
      ref={region}
      className="home-hero campaign-carousel"
      aria-roledescription="carousel"
      aria-label="Aram Narpavi campaign highlights"
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false); }}
      onKeyDown={onKeyDown}
    >
      <div className="campaign-carousel__slides" aria-live="off">
        {slides.map((slide, index) => (
          <article key={slide.theme} className={`campaign-slide campaign-slide--${slide.theme}${active === index ? " is-active" : ""}`} aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`} aria-hidden={active !== index}>
            <Image src={slide.image} alt={slide.alt} fill priority={index === 0} sizes="(max-width: 700px) 100vw, 90vw" className="campaign-slide__image" />
            <div className="campaign-slide__shade" aria-hidden="true" />
            <div className={`campaign-slide__copy${slide.theme === "countdown" ? " campaign-slide__copy--diwali" : ""}`}>
              <div className={slide.theme === "countdown" ? "visually-hidden" : ""}>
                <p className="eyebrow">{slide.eyebrow}</p>
                {index === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}
                <p className="campaign-slide__description">{slide.description}</p>
              </div>
              {slide.theme === "countdown" && (
                <div className="campaign-countdown" aria-label={countdown?.launched ? "The campaign has begun" : "Time until the campaign begins"}>
                  {countdown?.launched ? <p className="campaign-countdown__launched">The campaign begins today. Browse the collection.</p> : <>
                    <span className="campaign-countdown__label">Sale starts in</span>
                    <div className="campaign-countdown__units" aria-hidden="true">
                      {(["days", "hours", "minutes", "seconds"] as const).map((unit) => <span key={unit}><strong>{String(countdown?.[unit] ?? "--").padStart(2, "0")}</strong><small>{unit}</small></span>)}
                    </div>
                    <span className="visually-hidden">{countdown ? `${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds remaining` : "Countdown loading"}</span>
                  </>}
                </div>
              )}
              <Link className="button campaign-slide__cta" href={slide.href}>{slide.cta}<span aria-hidden="true">→</span></Link>
            </div>
            {slide.theme === "charcoal" && <div className="campaign-slide__product-note" aria-hidden="true">HERBAL SOAP · DAILY CARE</div>}
          </article>
        ))}
      </div>
      <button className="campaign-carousel__arrow campaign-carousel__arrow--prev" type="button" aria-label="Previous campaign" onClick={() => move(-1)}>‹</button>
      <button className="campaign-carousel__arrow campaign-carousel__arrow--next" type="button" aria-label="Next campaign" onClick={() => move(1)}>›</button>
      <div className="campaign-carousel__controls" aria-label="Choose campaign slide">
        {slides.map((slide, index) => <button key={slide.theme} type="button" aria-label={`Show slide ${index + 1}: ${slide.title}`} aria-current={active === index ? "true" : undefined} onClick={() => setActive(index)}><span /></button>)}
      </div>
    </section>
  );
}
