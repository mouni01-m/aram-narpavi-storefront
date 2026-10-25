import { SectionHeading } from "@/components/homepage/section-heading";
import { ComboOffers } from "@/components/sale/combo-offers";
import { getSaleSnapshot } from "@/components/sale/get-sale-snapshot";
import { CatalogProducts } from "@/components/sale/catalog-products";
import { SaleCollections } from "@/components/sale/sale-collections";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { saleContent } from "@/lib/content/sale";

/** Homepage sale flow: collections, combos and the searchable product grid. */
export async function SaleExperience() {
  const snapshot = await getSaleSnapshot();
  const copy = snapshot.campaignLive ? saleContent.products.live : saleContent.products.preview;
  return (
    <>
      <SaleCollections />
      <ComboOffers snapshot={snapshot} />
      <Section className="home-section sale-products" id="sale-products" aria-labelledby="sale-products-heading">
        <Container>
          <SectionHeading id="sale-products-heading" eyebrow="All products" title={copy.heading} description={copy.copy} />
          <CatalogProducts initialVisible={4} />
        </Container>
      </Section>
    </>
  );
}

export function SaleExperienceFallback() {
  return <div className="sale-experience-fallback" role="status"><span className="visually-hidden">Loading products</span></div>;
}
