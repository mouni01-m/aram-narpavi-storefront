"use client";

import Image from "next/image";
import { domAnimation, LazyMotion, m, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";

type Platform = {
  readonly name: string;
  readonly logo: { readonly src: string; readonly width: number; readonly height: number };
  /** Null until a verified store link is supplied; the card stays informational. */
  readonly href: string | null;
};

/** Enough copies to fill wide screens; the track loops across exactly half of them. */
const COPIES = 8;
/** Percent of the track per millisecond: one set of platforms passes about every 20 seconds. */
const SPEED = 100 / COPIES / 20000;

function PlatformCard({ platform, hidden }: { platform: Platform; hidden: boolean }) {
  const content = (
    <>
      <span className="platform-card__logo"><Image src={platform.logo.src} alt={`${platform.name} logo`} width={platform.logo.width} height={platform.logo.height} sizes="120px" loading="eager" /></span>
      <span className="platform-card__name">{platform.name}</span>
    </>
  );
  return platform.href
    ? <a className="platform-card" href={platform.href} target="_blank" rel="noreferrer" tabIndex={hidden ? -1 : undefined}>{content}</a>
    : <span className="platform-card">{content}</span>;
}

export function PlatformMarquee({ platforms }: { platforms: readonly Platform[] }) {
  const position = useMotionValue(-50);
  const x = useTransform(position, (value) => `${value}%`);
  const [paused, setPaused] = useState(false);
  const interacting = useRef(false);

  useAnimationFrame((_, delta) => {
    if (paused || interacting.current) return;
    // Long gaps from a backgrounded tab are capped so the strip never jumps.
    const next = position.get() + Math.min(delta, 100) * SPEED;
    position.set(next >= 0 ? next - 50 : next);
  });

  const hold = () => { interacting.current = true; };
  const release = () => { interacting.current = false; };

  return (
    <LazyMotion features={domAnimation}>
      <div className="platform-marquee" onMouseEnter={hold} onMouseLeave={release} onFocus={hold} onBlur={release}>
        <div className="platform-marquee__viewport">
          <m.div className="platform-marquee__track" style={{ x }}>
            {Array.from({ length: COPIES }, (_, copy) => (
              <ul className="platform-marquee__set" key={copy} data-copy={copy > 0 || undefined} aria-hidden={copy > 0 || undefined}>
                {platforms.map((platform) => <li key={platform.name}><PlatformCard platform={platform} hidden={copy > 0} /></li>)}
              </ul>
            ))}
          </m.div>
        </div>
        <button className="platform-marquee__toggle" type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused} aria-label="Pause platform animation">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">{paused ? <path d="M4 2.5v11l9-5.5z" /> : <path d="M4 2.5h3v11H4zm5 0h3v11H9z" />}</svg>
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </LazyMotion>
  );
}
