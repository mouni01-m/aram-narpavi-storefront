import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { catalogPreviewProducts } from "@/lib/content/catalog-preview";
import { ProductCard } from "@/components/products/product-card";

export const metadata: Metadata = {
  title: "Bestsellers | Aram Narpavi Herbals",
  description: "Explore featured Aram Narpavi Herbals products — a curated selection from our developing range of herbal soaps and pantry favourites.",
  alternates: { canonical: "/best-sellers" },
  robots: { index: false, follow: true },
};

export default function BestSellersPage() {
  const featured = catalogPreviewProducts;
  return (
    <main id="main-content" tabIndex={-1} className="catalog-page">
      <section className="catalog-intro">
        <Container>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-current="page">Bestsellers</span>
          </nav>
          <p className="eyebrow">Featured selection</p>
          <h1>Bestsellers</h1>
          <p className="catalog-lede">
            A curated selection from the Aram Narpavi Herbals range. These are featured products
            from our developing catalogue, not verified sales rankings.
          </p>
          <p className="catalog-draft-notice">Featured selection · verified bestseller rankings will be shown once sales data is available.</p>
        </Container>
      </section>
      <section className="catalog-section catalog-products" aria-labelledby="bestsellers-heading">
        <Container>
          <div className="catalog-section-heading">
            <div>
              <p className="eyebrow">Featured products</p>
              <h2 id="bestsellers-heading">Explore the selection</h2>
            </div>
            <p>Pricing and availability will appear after verification.</p>
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
