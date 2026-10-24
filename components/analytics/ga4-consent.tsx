"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const preferenceKey = "aram-analytics-consent";

export function Ga4Consent({ measurementId }: { measurementId?: string }) {
  const pathname = usePathname();
  const activeMeasurementId = measurementId?.trim();
  const validMeasurementId = activeMeasurementId && /^G-[A-Z0-9]+$/i.test(activeMeasurementId) ? activeMeasurementId : undefined;
  const [choice, setChoice] = useState<"pending" | "accepted" | "rejected">("pending");
  const configuredId = useRef<string | undefined>(undefined);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(preferenceKey);
      if (saved === "accepted" || saved === "rejected") {
        const timer = window.setTimeout(() => setChoice(saved), 0);
        return () => window.clearTimeout(timer);
      }
    } catch { /* Analytics remains unconfigured when browser storage is unavailable. */ }
  }, []);

  useEffect(() => {
    if (!validMeasurementId || choice !== "accepted") return;
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = window.gtag ?? function gtag(...args: unknown[]) { window.dataLayer?.push(args); };
    if (!document.querySelector(`script[data-ga4="${validMeasurementId}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(validMeasurementId)}`;
      script.dataset.ga4 = validMeasurementId;
      document.head.appendChild(script);
    }
    if (configuredId.current !== validMeasurementId) {
      window.gtag("js", new Date());
      window.gtag("config", validMeasurementId, { send_page_view: false, anonymize_ip: true });
      configuredId.current = validMeasurementId;
    }
    window.gtag("event", "page_view", { page_path: pathname });
  }, [choice, validMeasurementId, pathname]);

  useEffect(() => {
    if (!validMeasurementId || choice !== "accepted") return;
    const onStorefrontEvent = (event: Event) => {
      const detail = (event as CustomEvent<{
        name: string;
        itemId?: string;
        itemName?: string;
        items?: Array<{ itemId: string; itemName: string }>;
        videoTitle?: string;
        videoPercent?: number;
      }>).detail;
      if (detail?.name === "video_start" || detail?.name === "video_progress" || detail?.name === "video_complete") {
        window.gtag?.("event", detail.name, {
          video_title: detail.videoTitle ?? "Aram Narpavi Herbals brand story",
          ...(typeof detail.videoPercent === "number" ? { video_percent: detail.videoPercent } : {}),
        });
      } else if (detail?.name === "search" || detail?.name === "select_item" || detail?.name === "view_item" || detail?.name === "view_item_list") {
        // Do not forward free-text search terms; they can contain personal information.
        window.gtag?.("event", detail.name, {
          item_list_name: "Store preview",
          ...(detail.items ? { items: detail.items.map((item) => ({ item_id: item.itemId, item_name: item.itemName })) } : {}),
          ...((detail.name === "select_item" || detail.name === "view_item") && detail.itemId && detail.itemName
            ? { items: [{ item_id: detail.itemId, item_name: detail.itemName }] } : {}),
        });
      }
    };
    window.addEventListener("storefront-analytics", onStorefrontEvent);
    return () => window.removeEventListener("storefront-analytics", onStorefrontEvent);
  }, [choice, validMeasurementId]);

  if (!validMeasurementId || choice !== "pending") return null;
  const saveChoice = (next: "accepted" | "rejected") => {
    try { window.localStorage.setItem(preferenceKey, next); } catch { /* Current choice still applies to this visit. */ }
    setChoice(next);
  };
  return (
    <aside className="analytics-consent" aria-label="Analytics preferences">
      <p>Allow Google Analytics to measure visits and improve this preview? No product or personal details are sent.</p>
      <div><button type="button" onClick={() => saveChoice("rejected")}>Decline</button><button type="button" onClick={() => saveChoice("accepted")}>Allow analytics</button></div>
    </aside>
  );
}
