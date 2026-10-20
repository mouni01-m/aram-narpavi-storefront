import Link from "next/link";
import { ProductGallery } from "@/components/products/product-gallery";
import { Container } from "@/components/ui/container";
import { getPreviewProduct } from "@/lib/content/catalog-preview";
import { AddPreviewItemButton } from "@/components/cart/add-preview-item-button";

export function ProductDetailPage({ routeKey }: { routeKey: string }) {
  const product = getPreviewProduct(routeKey);
  if (!product) return null;

  return (
    <main id="main-content" tabIndex={-1} className="product-detail-page">
      <Container>
        <nav className="breadcrumbs product-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop preview</Link>
          <span aria-current="page">{product.name}</span>
        </nav>
        <article className="product-detail-layout">
          <ProductGallery images={product.images} productName={product.name} />
          <div className="product-detail-copy">
            <p className="eyebrow">Development product preview</p>
            <h1>{product.name}</h1>
            <p className="product-detail-status">Preview name only · not available to purchase</p>
            {product.description ? <p className="product-detail-description">{product.description}</p> : (
              <section className="product-verification-panel" aria-labelledby="details-pending-heading">
                <h2 id="details-pending-heading">Product details awaiting verification</h2>
                <p>Approved label information, description, pack size and product photography have not yet been supplied for this preview.</p>
              </section>
            )}
            <div className="product-commerce-boundary" aria-label="Purchase information status">
              <h2>Purchase information</h2>
              <p>Price, availability and purchase options will appear only after the product record and commerce connection are verified.</p>
            </div>
            <div className="preview-cart-action" aria-labelledby="preview-cart-action-heading">
              <h2 id="preview-cart-action-heading">Try the local cart prototype</h2>
              <p>This development action changes browser-memory state only. It does not reserve a product, check availability or create an order.</p>
              <AddPreviewItemButton productId={product.routeKey} productName={product.name} />
            </div>
            <Link className="text-link product-return-link" href="/shop">← Return to Shop preview</Link>
          </div>
        </article>
      </Container>
    </main>
  );
}
