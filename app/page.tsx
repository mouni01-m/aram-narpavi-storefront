import type { Metadata } from "next";
import { CategorySection } from "@/components/homepage/category-section";
import { FeaturedProducts } from "@/components/homepage/featured-products";
import { FinalCta } from "@/components/homepage/final-cta";
import { HomepageHero } from "@/components/homepage/hero";
import { InstagramShowcase } from "@/components/homepage/instagram-showcase";
import { PhilosophySection } from "@/components/homepage/philosophy-section";
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
      { "@type": "Organization", name: "Aram Narpavi Herbals", url: siteUrl.toString(), logo: new URL("/images/brand/aram-narpavi-logo.png", siteUrl).toString(), sameAs: ["https://www.instagram.com/aramnarpaviherbals/"] },
      { "@type": "WebSite", name: "Aram Narpavi Herbals", url: siteUrl.toString() },
    ],
  } : null;
  return (
    <main id="main-content" tabIndex={-1}>
      {structuredData ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /> : null}
      <HomepageHero />
      <CategorySection />
      <FeaturedProducts />
      <PhilosophySection />
      <InstagramShowcase />
      <FinalCta />
    </main>
  );
}
