"use client";

import { useRef } from "react";

const videoTitle = "Aram Narpavi Herbals brand story";

function sendVideoEvent(name: "video_start" | "video_progress" | "video_complete", videoPercent?: number) {
  window.dispatchEvent(new CustomEvent("storefront-analytics", {
    detail: { name, videoTitle, ...(videoPercent ? { videoPercent } : {}) },
  }));
}

export function BrandAdVideo({ poster }: { poster?: string }) {
  const started = useRef(false);
  const sentProgress = useRef(new Set<number>());

  return (
    <video
      className="philosophy-video"
      controls
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label="Aram Narpavi Herbals brand advertisement"
      onPlay={() => {
        if (started.current) return;
        started.current = true;
        sendVideoEvent("video_start");
      }}
      onTimeUpdate={(event) => {
        const { currentTime, duration } = event.currentTarget;
        if (!Number.isFinite(duration) || duration <= 0) return;
        for (const percent of [25, 50, 75]) {
          if (currentTime / duration >= percent / 100 && !sentProgress.current.has(percent)) {
            sentProgress.current.add(percent);
            sendVideoEvent("video_progress", percent);
          }
        }
      }}
      onEnded={() => sendVideoEvent("video_complete", 100)}
    >
      <source src="/videos/aram-narpavi-brand-ad.mp4" type="video/mp4" />
      Your browser does not support embedded videos.
    </video>
  );
}
