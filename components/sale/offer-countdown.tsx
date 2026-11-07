"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState } from "react";

const units = ["days", "hours", "minutes", "seconds"] as const;

function partsUntil(end: number, now: number) {
  const left = Math.max(0, end - now);
  return {
    days: Math.floor(left / 86_400_000),
    hours: Math.floor((left % 86_400_000) / 3_600_000),
    minutes: Math.floor((left % 3_600_000) / 60_000),
    seconds: Math.floor((left % 60_000) / 1000),
  };
}

/** Counts down to a fixed date from the configuration, so refreshing the page never resets it. */
export function OfferCountdown({ endsAt, onExpire }: { endsAt: string; onExpire: () => void }) {
  const end = Date.parse(endsAt);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current >= end) onExpire();
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [end, onExpire]);

  const parts = now === null ? null : partsUntil(end, now);
  return (
    <div className="offer-countdown" role="timer" aria-label={parts ? `Offer ends in ${parts.days} days, ${parts.hours} hours and ${parts.minutes} minutes` : "Offer countdown loading"}>
      <span className="offer-countdown__label">Offer ends in</span>
      <div className="offer-countdown__boxes" aria-hidden="true">
        {units.map((unit, index) => (
          <div className="offer-countdown__unit" key={unit}>
            {index ? <span className="offer-countdown__colon">:</span> : null}
            <div className="offer-countdown__box">
              <span className="offer-countdown__value">
                <AnimatePresence initial={false} mode="popLayout">
                  <m.span key={parts ? parts[unit] : "--"} initial={{ y: "-60%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "60%", opacity: 0 }} transition={{ duration: 0.28, ease: "easeOut" }}>
                    {parts ? String(parts[unit]).padStart(2, "0") : "--"}
                  </m.span>
                </AnimatePresence>
              </span>
              <small>{unit}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
