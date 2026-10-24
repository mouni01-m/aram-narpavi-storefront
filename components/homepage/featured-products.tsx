import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/homepage/section-heading";
import { catalogPreviewProducts } from "@/lib/content/catalog-preview";
import { ProductCard } from "@/components/products/product-card";
import Link from "next/link";

export function FeaturedProducts() {
  return (
    <Section className="home-section featured-section" id="featured" aria-labelledby="featured-heading">
      <Container>
        <div className="featured-heading-row">
          <SectionHeading id="featured-heading" eyebrow="Explore the range" title="Featured products" />
          <span className="preview-pill">Local preview · details pending</span>
        </div>
        <p className="section-description featured-intro">
          Start with a few names from the developing range. Verified specifications, pricing and availability will be added once confirmed.
        </p>
        <div className="product-preview-grid">
          {catalogPreviewProducts.map((product, index) => <ProductCard key={product.name} product={product} index={index} />)}
        </div>
        <p className="catalog-more-link"><Link className="text-link" href="/shop">Browse and filter all preview names →</Link></p>
      </Container>
    </Section>
  );
}
