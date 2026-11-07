"use client";

import { useEffect, useState } from "react";

const endFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata", timeZoneName: "short" });

function remaining(endsAt: number, now: number) {
  const ms = Math.max(0, endsAt - now);
  return { ms, days: Math.floor(ms / 86_400_000), hours: Math.floor((ms % 86_400_000) / 3_600_000), minutes: Math.floor((ms % 3_600_000) / 60_000) };
}

/**
 * Shown only for an active campaign with a configured end time. Display only: the server
 * stops applying the offer at `endsAt` regardless of this clock.
 */
export function CampaignCountdown({ endsAt }: { endsAt: string }) {
  const end = Date.parse(endsAt);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!Number.isFinite(end)) return null;
  if (now === null) return <p className="campaign-countdown-line">Ends {endFormat.format(end)}</p>;
  const left = remaining(end, now);
  if (left.ms === 0) return <p className="campaign-countdown-line" role="status">This offer has ended. Refresh to see current prices.</p>;
  return (
    <p className="campaign-countdown-line">
      Ends in <strong>{left.days ? `${left.days}d ` : ""}{left.hours}h {String(left.minutes).padStart(2, "0")}m</strong>
      <span className="campaign-countdown-line__date"> · {endFormat.format(end)}</span>
    </p>
  );
}
