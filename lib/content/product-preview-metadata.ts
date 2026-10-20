import type { Metadata } from "next";
import { getPreviewProduct } from "@/lib/content/catalog-preview";

export function getProductPreviewMetadata(routeKey: string): Metadata {
  const product = getPreviewProduct(routeKey);
  return {
    title: `${product?.name ?? "Product"} preview | Aram Narpavi Herbals`,
    description: product ? `Development preview for ${product.name}. Verified product details and availability are pending.` : "Product preview not found.",
    robots: { index: false, follow: false, nocache: true },
  };
}
