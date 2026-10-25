"use client";

import { useCart } from "@/components/cart/cart-provider";

export function AddPreviewItemButton({ productId, productName, compact = false, disabled = false }: { productId: string; productName: string; compact?: boolean; disabled?: boolean }) {
  const { addPreviewItem } = useCart();
  const label = `Add ${productName} to preview cart`;
  return (
    <button className={`button button--outline${compact ? " button--compact" : ""}`} type="button" onClick={() => addPreviewItem(productId)} disabled={disabled} aria-label={compact ? label : undefined}>
      {compact ? "Add to preview cart" : label}
    </button>
  );
}
