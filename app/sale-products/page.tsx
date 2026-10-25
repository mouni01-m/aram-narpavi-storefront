import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeading } from "@/components/homepage/section-heading";
import { CampaignHero } from "@/components/sale/campaign-hero";
import { getCampaignView } from "@/components/sale/campaign-data";
import { CatalogProducts } from "@/components/sale/catalog-products";
import { ComboOffers } from "@/components/sale/combo-offers";
import { OfferHighlights } from "@/components/sale/offer-highlights";
import { ProductSpotlight } from "@/components/sale/product-spotlight";
import { SaleAnnouncement } from "@/components/sale/sale-announcement";
import { SaleCollections } from "@/components/sale/sale-collections";
import { ShoppingInformation } from "@/components/sale/shopping-information";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { saleContent } from "@/lib/content/sale";

export const metadata: Metadata = {
  title: "The Heritage Sale | Aram Narpavi Herbals",
  description: "The Aram Narpavi Heritage Sale: herbal soaps, traditional mixes, pantry favourites and oils & balms, with curated combinations.",
  alternates: { canonical: "/sale-products" },
  // Prices are development estimates until approved, so keep the page out of search results.
  robots: { index: false, follow: true },
};

const copy = saleContent.campaign;

/** Campaign-first sale page. Sections reuse the shared catalogue, pricing and cart components. */
async function HeritageSale() {
  const view = await getCampaignView();
  const combosArePreview = view.snapshot.bundles.some((offer) => offer.kind === "illustrative");
  return (
    <>
      <SaleAnnouncement href="#sale-products" />
      <CampaignHero view={view} />
      <OfferHighlights view={view} />
      <SaleCollections />
      <ComboOffers snapshot={view.snapshot} eyebrow={copy.combos.eyebrow} description={copy.combos.copy} note={combosArePreview ? copy.combos.previewNote : undefined} />
      <ProductSpotlight view={view} />
      <Section className="home-section sale-products" id="sale-products" aria-labelledby="sale-products-heading">
        <Container>
          <SectionHeading id="sale-products-heading" eyebrow="The full range" title={copy.products.heading} description={copy.products.copy} />
          <CatalogProducts />
        </Container>
      </Section>
    </>
  );
}

export default function SaleProductsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="campaign-page">
      <Suspense fallback={<div className="campaign-page-fallback" role="status"><span className="visually-hidden">Loading the Heritage Sale</span></div>}>
        <HeritageSale />
      </Suspense>
      <ShoppingInformation />
    </main>
  );
}
