import Image from "next/image";
import Link from "next/link";
import type { PreviewProduct } from "@/lib/content/catalog-preview";

export function ProductCard({ product, index }: { product: PreviewProduct; index: number }) {
  const image = product.images[0];
  return (
    <article className="product-preview-card">
      <Link className={`product-photo-placeholder product-photo-placeholder--${(index % 4) + 1}`} href={`/products/${product.routeKey}`} aria-label={`View ${product.name} preview`}>
        {image ? <Image src={image.src} alt={image.alt} fill sizes="(max-width: 430px) 85vw, (max-width: 900px) 42vw, 22vw" /> : <span className="product-image-pending">Product photography pending</span>}
        <span className="product-preview-badge">Preview</span>
      </Link>
      <div className="product-preview-card__body">
        <h3><Link href={`/products/${product.routeKey}`}>{product.name}</Link></h3>
        <span className="preview-note">Details and pricing awaiting verification</span>
        <Link className="product-preview-link" href={`/products/${product.routeKey}`}>View product details <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
