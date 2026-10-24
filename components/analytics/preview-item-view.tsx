"use client";

import { useEffect, useRef } from "react";

export function PreviewItemView({ itemId, itemName }: { itemId: string; itemName: string }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    window.dispatchEvent(new CustomEvent("storefront-analytics", { detail: { name: "view_item", itemId, itemName } }));
  }, [itemId, itemName]);
  return null;
}
