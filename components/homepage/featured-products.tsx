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
          <SectionHeading id="featured-heading" eyebrow="Product previews" title="A closer look" />
          <span className="preview-pill">Local preview · details pending</span>
        </div>
        <p className="section-description featured-intro">
          Explore the product previews. Product details, images, prices and availability are not confirmed; check approved labels when available.
        </p>
        <div className="product-preview-grid">
          {catalogPreviewProducts.map((product, index) => <ProductCard key={product.name} product={product} index={index} />)}
        </div>
        <p className="catalog-more-link"><Link className="text-link" href="/shop">Browse and filter all preview names →</Link></p>
      </Container>
    </Section>
  );
}
