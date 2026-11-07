import { getSaleSnapshot } from "@/components/sale/get-sale-snapshot";
import { NewArrivalCombo, type NewArrivalView } from "@/components/sale/new-arrival-combo";
import { saleSectionFont } from "@/components/sale/section-font";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { priceOf } from "@/lib/commerce/sale-filters";
import { featuredCombo } from "@/lib/commerce/sale-config";
import { comboItemNotes } from "@/lib/content/sale";

/** New Arrival Offer: resolved on the server, so the browser never decides a price or the offer state. */
export async function NewArrivalOffer() {
  const snapshot = await getSaleSnapshot();
  const resolved = snapshot.featuredCombo;
  if (!resolved) return null;
  const byId = new Map(snapshot.products.map((product) => [product.id, product]));
  const view: NewArrivalView = {
    id: resolved.id,
    title: featuredCombo.bundle.name,
    description: featuredCombo.bundle.description,
    endsAt: featuredCombo.endsAt,
    state: resolved.state,
    isEstimate: resolved.isEstimate,
    pricing: resolved.pricing,
    composition: featuredCombo.composition,
    items: featuredCombo.bundle.items.flatMap((item) => {
      const product = byId.get(item.productId);
      if (!product) return [];
      const price = priceOf(product);
      return [{ id: product.id, name: product.name, href: product.href, image: product.image, price, linePrice: price === null ? null : price * item.quantity, quantity: item.quantity, note: comboItemNotes[product.id] ?? null, hotspot: featuredCombo.hotspots[product.id] ?? null }];
    }),
    betterTogether: featuredCombo.betterTogether.flatMap((id) => {
      const product = byId.get(id);
      return product ? [{ id: product.id, name: product.name, href: product.href, image: product.image, price: priceOf(product) }] : [];
    }),
  };
  return (
    <Section className={`home-section offer-section ${saleSectionFont.variable}`} id="new-arrival-offer" aria-labelledby="new-arrival-heading">
      <Container>
        <NewArrivalCombo view={view} fontClassName={saleSectionFont.variable} />
      </Container>
    </Section>
  );
}

export function NewArrivalOfferFallback() {
  return <div className="new-arrival-fallback" role="status"><span className="visually-hidden">Loading the New Arrival Offer</span></div>;
}
