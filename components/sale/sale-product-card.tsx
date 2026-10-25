import Link from "next/link";
import { AddPreviewItemButton } from "@/components/cart/add-preview-item-button";
import { OfferPrice } from "@/components/sale/offer-price";
import { ProductPhoto } from "@/components/products/product-photo";
import type { SaleProductView } from "@/lib/commerce/sale-filters";

export function SaleProductCard({ product, collectionTitle }: { product: SaleProductView; collectionTitle: string | null }) {
  const outOfStock = product.offer.kind === "priced" && product.offer.availability === "out-of-stock";
  return (
    <article className="sale-product-card">
      <div className="sale-product-card__media">
        <ProductPhoto image={product.image} name={product.name} sizes="(max-width: 700px) 46vw, (max-width: 1000px) 30vw, 22vw" />
        {product.offer.kind === "priced" && product.offer.discountPercent > 0 ? <span className="sale-product-card__badge" aria-hidden="true">{product.offer.discountPercent}% off</span> : null}
      </div>
      <div className="sale-product-card__body">
        {collectionTitle ? <p className="sale-product-card__collection">{collectionTitle}</p> : null}
        <h3><Link href={product.href}>{product.name}</Link></h3>
        <OfferPrice offer={product.offer} />
        <div className="sale-product-card__actions">
          <Link className="text-link sale-product-card__details" href={product.href}>View details<span className="visually-hidden"> for {product.name}</span></Link>
          <AddPreviewItemButton productId={product.id} productName={product.name} compact disabled={outOfStock} />
        </div>
      </div>
    </article>
  );
}
