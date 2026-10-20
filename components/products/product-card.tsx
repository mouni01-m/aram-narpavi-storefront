import type { PreviewProduct } from "@/lib/content/catalog-preview";
import Link from "next/link";

export function ProductCard({ product, index }: { product: PreviewProduct; index: number }) {
  return (
    <article className="product-preview-card">
      <div className={`product-photo-placeholder product-photo-placeholder--${(index % 4) + 1}`}>
        <span>Product photo<br />pending</span>
      </div>
      <div className="product-preview-card__body">
        <h3><Link href={`/products/${product.routeKey}`}>{product.name}</Link></h3>
        <span className="preview-note">Development preview · not available to purchase</span>
        <Link className="product-preview-link" href={`/products/${product.routeKey}`}>View preview details <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
