import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { catalogPreviewProducts } from "@/lib/content/catalog-preview";
import { ProductCard } from "@/components/products/product-card";

export const metadata: Metadata = {
  title: "Heritage Sale | Aram Narpavi Herbals",
  description: "Explore the Heritage Sale from Aram Narpavi Herbals. Selected herbal and pantry favourites with verified savings on eligible products.",
  alternates: { canonical: "/heritage-sale" },
  robots: { index: false, follow: true },
};

export default function HeritageSalePage() {
  const featured = catalogPreviewProducts.slice(0, 4);
  return (
    <main id="main-content" tabIndex={-1} className="heritage-sale-page">
      <section className="heritage-sale-hero">
        <Container>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-current="page">Heritage Sale</span>
          </nav>
          <p className="eyebrow">Heritage Sale · Limited time</p>
          <h1>Natural favourites, thoughtfully priced.</h1>
          <p className="heritage-sale-lede">
            During the Heritage Sale, explore selected herbal and pantry favourites from Aram Narpavi Herbals.
            Verified savings are shown on eligible products once pricing is confirmed.
          </p>
          <div className="heritage-sale-terms">
            <p>
              <strong>Sale details:</strong> Exact sale dates, eligible products and discount percentages
              will be displayed once approved by the business. Discounts will not exceed 15% per the approved offer policy.
            </p>
          </div>
          <Link className="button heritage-sale-cta" href="/shop">Shop all products <span aria-hidden="true">→</span></Link>
        </Container>
      </section>
      <section className="heritage-sale-products" aria-labelledby="sale-products-heading">
        <Container>
          <div className="catalog-section-heading">
            <div>
              <p className="eyebrow">Eligible favourites</p>
              <h2 id="sale-products-heading">Explore selected products</h2>
            </div>
            <p>Pricing and savings will appear after verification. No purchase is available in this preview.</p>
          </div>
          <div className="product-preview-grid">
            {featured.map((product, index) => <ProductCard key={product.name} product={product} index={index} />)}
          </div>
          <p className="catalog-more-link">
            <Link className="text-link" href="/shop">Browse all products →</Link>
          </p>
        </Container>
      </section>
    </main>
  );
}
