"use client";

import { useCart } from "@/components/cart/cart-provider";

export function AddPreviewBundleButton({ bundleId, bundleName, className = "" }: { bundleId: string; bundleName: string; className?: string }) {
  const { addPreviewBundle } = useCart();
  return (
    <button className={`button ${className}`.trim()} type="button" onClick={() => addPreviewBundle(bundleId)} aria-label={`Add ${bundleName} to preview cart`}>
      Add combo
    </button>
  );
}
