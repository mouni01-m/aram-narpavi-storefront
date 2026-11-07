import { SectionHeading } from "@/components/homepage/section-heading";
import { ComboCarousel, type ComboView } from "@/components/sale/combo-carousel";
import { saleSectionFont } from "@/components/sale/section-font";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import type { SaleSnapshot } from "@/lib/commerce/sale-catalog";
import { priceOf, type SaleProductView } from "@/lib/commerce/sale-filters";
import { comboItemNotes, saleContent } from "@/lib/content/sale";

type ComboOffer = SaleSnapshot["bundles"][number];

/** Display-ready combo, resolved on the server so the browser never decides an offer. */
function toComboView(offer: ComboOffer, products: ReadonlyMap<string, SaleProductView>): ComboView {
  const { bundle } = offer;
  return {
    id: bundle.id,
    name: bundle.name,
    description: bundle.description,
    isEstimate: offer.kind === "illustrative",
    pricing: offer.kind === "preview" ? null : { referenceTotal: offer.referenceTotal, bundlePrice: offer.bundlePrice, savings: offer.savings, discountPercent: offer.discountPercent },
    items: bundle.items.map((item) => {
      const product = products.get(item.productId);
      const price = product ? priceOf(product) : null;
      return {
        id: item.productId,
        name: product?.name ?? item.productId,
        href: product?.href ?? null,
        quantity: item.quantity,
        linePrice: price === null ? null : price * item.quantity,
        image: product?.image ?? null,
        note: comboItemNotes[item.productId] ?? null,
      };
    }),
  };
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
    <Section className={`home-section combo-section ${saleSectionFont.variable}`} id="combos" aria-labelledby="combo-heading">
      <Container>
        <SectionHeading id="combo-heading" eyebrow={eyebrow} title={saleContent.combos.heading} description={description ?? (snapshot.campaignLive ? saleContent.combos.live : saleContent.combos.preview)} align="center" />
        {note ? <p className="combo-section__note">{note}</p> : null}
        {snapshot.bundles.length
          ? <ComboCarousel combos={snapshot.bundles.map((offer) => toComboView(offer, products))} fontClassName={saleSectionFont.variable} />
          : <p className="preview-note">No combos are available right now.</p>}
      </Container>
    </Section>
  );
}
