import type { Metadata } from "next";
import { Suspense } from "react";
import { FaqPreview } from "@/components/homepage/faq-preview";
import { FinalCta } from "@/components/homepage/final-cta";
import { HomepageHero } from "@/components/homepage/hero";
import { PhilosophySection } from "@/components/homepage/philosophy-section";
import { ProductInformation } from "@/components/homepage/product-information";
import { SaleAnnouncement, SaleAnnouncementFallback } from "@/components/sale/sale-announcement";
import { SaleExperience, SaleExperienceFallback } from "@/components/sale/sale-experience";
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
      <Suspense fallback={<SaleAnnouncementFallback />}><SaleAnnouncement /></Suspense>
      <HomepageHero />
      <Suspense fallback={<SaleExperienceFallback />}><SaleExperience /></Suspense>
      <PhilosophySection />
      <ProductInformation />
      <FaqPreview />
      <FinalCta />
    </main>
  );
}
