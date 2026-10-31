"use client";

import { useEffect, useState } from "react";

const SALE_START_MS = Date.parse("2026-11-06T00:00:00+05:30");
const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function splitRemaining(remainingMs: number) {
  return [
    { value: Math.floor(remainingMs / DAY_MS), label: "days" },
    { value: Math.floor((remainingMs % DAY_MS) / HOUR_MS), label: "hours" },
    { value: Math.floor((remainingMs % HOUR_MS) / MINUTE_MS), label: "minutes" },
    { value: Math.floor((remainingMs % MINUTE_MS) / SECOND_MS), label: "seconds" },
  ];
}

export function DiwaliCountdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), SECOND_MS);
    return () => clearInterval(timer);
  }, []);

  if (now !== null && now >= SALE_START_MS) {
    return <p className="campaign-countdown__launched">The Diwali Special is now live.</p>;
  }

  const units = now === null ? null : splitRemaining(SALE_START_MS - now);

  return (
    <div className="campaign-countdown" aria-label="Time until the Diwali Special begins">
      <span className="campaign-countdown__label">Sale starts in</span>
      <div className="campaign-countdown__units" aria-hidden="true">
        {(units ?? ["days", "hours", "minutes", "seconds"].map((label) => ({ value: null, label }))).map((unit) => (
          <span key={unit.label}>
            <strong>{unit.value === null ? "--" : String(unit.value).padStart(2, "0")}</strong>
            <small>{unit.label}</small>
          </span>
        ))}
      </div>
    </div>
  );
}
