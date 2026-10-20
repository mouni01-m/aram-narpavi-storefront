"use client";

import { useCart } from "@/components/cart/cart-provider";

export function AddPreviewItemButton({ productId, productName }: { productId: string; productName: string }) {
  const { addPreviewItem } = useCart();
  return <button className="button button--outline" type="button" onClick={() => addPreviewItem(productId)}>Add {productName} to preview cart</button>;
}
