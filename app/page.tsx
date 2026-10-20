import type { Metadata } from "next";
import { CategorySection } from "@/components/homepage/category-section";
import { FaqPreview } from "@/components/homepage/faq-preview";
import { FeaturedProducts } from "@/components/homepage/featured-products";
import { FinalCta } from "@/components/homepage/final-cta";
import { HomepageHero } from "@/components/homepage/hero";
import { PhilosophySection } from "@/components/homepage/philosophy-section";
import { ProductInformation } from "@/components/homepage/product-information";
import { homepageMeta } from "@/lib/content/homepage";

export const metadata: Metadata = {
  title: homepageMeta.title,
  description: homepageMeta.description,
};

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HomepageHero />
      <CategorySection />
      <FeaturedProducts />
      <PhilosophySection />
      <ProductInformation />
      <FaqPreview />
      <FinalCta />
    </main>
  );
}
