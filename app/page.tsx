import type { Metadata } from "next";
import { Suspense } from "react";
import { FaqPreview } from "@/components/homepage/faq-preview";
import { FinalCta } from "@/components/homepage/final-cta";
import { HomepageHero } from "@/components/homepage/hero";
import { SectionHeading } from "@/components/homepage/section-heading";
import { ConcernGroups } from "@/components/homepage/shop-by-concern";
import { PhilosophySection } from "@/components/homepage/philosophy-section";
import { StoreAvailability } from "@/components/homepage/store-availability";
import { SaleExperience, SaleExperienceFallback } from "@/components/sale/sale-experience";
import { NewArrivalOffer, NewArrivalOfferFallback } from "@/components/sale/new-arrival-offer";
import { saleSectionFont } from "@/components/sale/section-font";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { homepageMeta } from "@/lib/content/homepage";
import { getSiteUrl } from "@/lib/config/site-url";

export const metadata: Metadata = {
  title: homepageMeta.title,
  description: homepageMeta.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  const siteUrl = getSiteUrl();
  const structuredData = siteUrl ? {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", name: "Aram Narpavi Herbals", url: siteUrl.toString(), logo: new URL("/images/brand/aram-narpavi-logo.png", siteUrl).toString() },
      { "@type": "WebSite", name: "Aram Narpavi Herbals", url: siteUrl.toString() },
    ],
  } : null;
  return (
    <main id="main-content" tabIndex={-1}>
      {structuredData ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /> : null}
      <HomepageHero />
      <Suspense fallback={<SaleExperienceFallback />}><SaleExperience /></Suspense>
      <Section className={`home-section concern-section ${saleSectionFont.variable}`} aria-labelledby="concern-heading">
        <Container>
          <SectionHeading id="concern-heading" title="Shop by Concern" description="Find natural care for your everyday skin and hair needs." align="center" />
          <ConcernGroups />
        </Container>
      </Section>
      <Suspense fallback={<NewArrivalOfferFallback />}><NewArrivalOffer /></Suspense>
      <PhilosophySection />
      <StoreAvailability />
      <FaqPreview />
      <FinalCta />
    </main>
  );
}
