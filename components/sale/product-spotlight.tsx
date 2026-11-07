import Link from "next/link";
import { AddPreviewItemButton } from "@/components/cart/add-preview-item-button";
import { ProductPhoto } from "@/components/products/product-photo";
import type { CampaignView } from "@/components/sale/campaign-data";
import { OfferPrice } from "@/components/sale/offer-price";
import { Container } from "@/components/ui/container";
import { getPreviewCollection, getPreviewProduct } from "@/lib/content/catalog-preview";
import { saleContent } from "@/lib/content/sale";

/**
 * Editorial spotlight for the configured featured product. Shows only catalogue facts:
 * no ranking, rating or unverified description.
 */
export function ProductSpotlight({ view }: { view: CampaignView }) {
  const product = view.snapshot.products.find((candidate) => candidate.id === view.featuredProductId);
  const record = product ? getPreviewProduct(product.id) : undefined;
  if (!product || !record) return null;
  const collection = product.collectionSlug ? getPreviewCollection(product.collectionSlug) : undefined;
  const combos = view.snapshot.bundles.filter((offer) => offer.bundle.items.some((item) => item.productId === product.id));
  const [primary, secondary] = record.images;

  return (
    <section className="product-spotlight" aria-labelledby="spotlight-heading">
      <Container className="product-spotlight__inner">
        <div className="product-spotlight__media">
          <ProductPhoto image={primary ?? null} name={product.name} sizes="(max-width: 800px) 92vw, 34vw" className="product-spotlight__photo" />
          {secondary ? <ProductPhoto image={secondary} name={product.name} sizes="(max-width: 800px) 46vw, 18vw" className="product-spotlight__photo product-spotlight__photo--secondary" /> : null}
        </div>
        <div className="product-spotlight__copy">
          <p className="eyebrow">{saleContent.campaign.spotlight.eyebrow}</p>
          <h2 id="spotlight-heading">{saleContent.campaign.spotlight.heading}</h2>
          <div className="product-spotlight__product">
            {collection ? <p className="product-spotlight__collection">{collection.title}</p> : null}
            <h3><Link href={product.href}>{product.name}</Link></h3>
            <OfferPrice offer={product.offer} />
            {combos.length ? (
              <p className="product-spotlight__combos">
                Also in {combos.map((offer, index) => <span key={offer.bundle.id}>{index ? ", " : ""}<a href="#combos">{offer.bundle.name}</a></span>)}.
              </p>
            ) : null}
          </div>
          <div className="product-spotlight__actions">
            <Link className="button" href={product.href}>View product details</Link>
            <AddPreviewItemButton productId={product.id} productName={product.name} compact />
          </div>
        </div>
      </Container>
    </section>
  );
}
