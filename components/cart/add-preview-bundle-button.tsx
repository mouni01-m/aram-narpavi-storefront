"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";

const ADDED_MS = 1800;

export function AddPreviewBundleButton({ bundleId, bundleName, label = "Add combo", className = "" }: { bundleId: string; bundleName: string; label?: string; className?: string }) {
  const { addPreviewBundle } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), ADDED_MS);
    return () => window.clearTimeout(timer);
  }, [added]);

  return (
    <button
      className={`button ${className}`.trim()}
      type="button"
      onClick={() => {
        addPreviewBundle(bundleId);
        setAdded(true);
      }}
      aria-label={`${label}: ${bundleName}, preview cart`}
    >
      {added ? "Added to cart ✓" : label}
    </button>
  );
}
