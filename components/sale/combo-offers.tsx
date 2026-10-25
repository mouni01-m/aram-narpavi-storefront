import Link from "next/link";
import { AddPreviewBundleButton } from "@/components/cart/add-preview-bundle-button";
import { SectionHeading } from "@/components/homepage/section-heading";
import { ProductPhoto } from "@/components/products/product-photo";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { formatRupees } from "@/lib/commerce/pricing";
import type { SaleSnapshot } from "@/lib/commerce/sale-catalog";
import { priceOf, type SaleProductView } from "@/lib/commerce/sale-filters";
import { saleContent } from "@/lib/content/sale";

type ComboOffer = SaleSnapshot["bundles"][number];

function ComboPricing({ offer }: { offer: ComboOffer }) {
  if (offer.kind === "preview") return <p className="combo-card__pending">Combo price awaiting approval</p>;
  return (
    <div className="combo-card__pricing">
      <dl>
        <div><dt>Bought separately</dt><dd><s>{formatRupees(offer.referenceTotal)}</s></dd></div>
        <div className="combo-card__bundle-price"><dt>Combo price</dt><dd>{formatRupees(offer.bundlePrice)}</dd></div>
        <div className="combo-card__saving"><dt>You save</dt><dd>{formatRupees(offer.savings)} ({offer.discountPercent}%)</dd></div>
      </dl>
    </div>
  );
}

function ComboCard({ offer, products }: { offer: ComboOffer; products: ReadonlyMap<string, SaleProductView> }) {
  const { bundle } = offer;
  const headingId = `combo-${bundle.id}`;
  return (
    <article className="combo-card" aria-labelledby={headingId}>
      <div className={`combo-card__mosaic combo-card__mosaic--${Math.min(bundle.items.length, 5)}`}>
        {bundle.items.map((item) => {
          const product = products.get(item.productId);
          return <ProductPhoto key={item.productId} image={product?.image ?? null} name={product?.name ?? item.productId} sizes="(max-width: 700px) 50vw, 22vw" className="combo-card__tile" />;
        })}
        {/* After the tiles, so the mosaic's :first-child span rule still targets the first photo. */}
        {offer.kind !== "preview" ? <span className="combo-card__ribbon">Save {formatRupees(offer.savings)}</span> : null}
      </div>
      <div className="combo-card__body">
        <p className="combo-card__count">{bundle.items.length} products</p>
        <h3 id={headingId}>{bundle.name}</h3>
        <p className="combo-card__description">{bundle.description}</p>
        <ul className="combo-card__items">
          {bundle.items.map((item) => {
            const product = products.get(item.productId);
            const price = product ? priceOf(product) : null;
            return (
              <li key={item.productId}>
                <span>{item.quantity} × {product ? <Link href={product.href}>{product.name}</Link> : item.productId}</span>
                {price !== null ? <span className="combo-card__item-price">{formatRupees(price * item.quantity)}</span> : null}
              </li>
            );
          })}
        </ul>
        <ComboPricing offer={offer} />
        <AddPreviewBundleButton bundleId={bundle.id} bundleName={bundle.name} className="combo-card__action" />
      </div>
    </article>
  );
}

export function ComboOffers({ snapshot, eyebrow = "Curated combos", description, note }: {
  snapshot: SaleSnapshot;
  eyebrow?: string;
  description?: string;
  /** Short line under the heading, for example a preview-pricing notice. */
  note?: string;
}) {
  const products = new Map(snapshot.products.map((product) => [product.id, product]));
  return (
    <Section className="home-section combo-section" id="combos" aria-labelledby="combo-heading">
      <Container>
        <SectionHeading id="combo-heading" eyebrow={eyebrow} title={saleContent.combos.heading} description={description ?? (snapshot.campaignLive ? saleContent.combos.live : saleContent.combos.preview)} />
        {note ? <p className="combo-section__note">{note}</p> : null}
        {snapshot.bundles.length ? (
          <div className="combo-grid">
            {snapshot.bundles.map((offer) => <ComboCard key={offer.bundle.id} offer={offer} products={products} />)}
          </div>
        ) : <p className="preview-note">No combos are available right now.</p>}
      </Container>
    </Section>
  );
}
