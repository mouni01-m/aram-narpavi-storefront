import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { Container } from "@/components/ui/container";
import { catalogPreviewProducts } from "@/lib/content/catalog-preview";

export const metadata: Metadata = {
  title: "Combos & Gift Sets | Aram Narpavi Herbals",
  description: "Explore products from Aram Narpavi Herbals that will be available as combos and gift sets. Bundle pricing will be confirmed before orders open.",
  alternates: { canonical: "/combos" },
  robots: { index: false, follow: true },
};

export default function CombosPage() {
  return (
    <main id="main-content" tabIndex={-1} className="combos-page">
      <Container>
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-current="page">Combos & Gift Sets</span>
        </nav>
        <header className="combos-page__intro">
          <p className="eyebrow">Bundles and gift sets</p>
          <h1>Combos & Gift Sets</h1>
          <p>Products that will be available as combos. Bundle pricing and included items will be confirmed before orders open. Prices shown are tentative.</p>
        </header>
        <ul className="combos-page__grid">
          {catalogPreviewProducts.map((product, index) => (
            <li key={product.routeKey}>
              <ProductCard product={product} index={index} />
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
