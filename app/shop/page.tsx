import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CatalogProducts, CatalogProductsFallback } from "@/components/sale/catalog-products";
import { Container } from "@/components/ui/container";
import { discoverablePreviewCollections } from "@/lib/content/catalog-preview";

export const metadata: Metadata = {
  title: "Shop preview | Aram Narpavi Herbals",
  description: "Browse development preview names and proposed collection groupings from Aram Narpavi Herbals. Product details and availability are not confirmed.",
  robots: { index: false, follow: true },
};

export default function ShopPage() {
  return <main id="main-content" tabIndex={-1} className="catalog-page">
    <section className="catalog-intro"><Container>
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-current="page">Shop preview</span></nav>
      <p className="eyebrow">Browse the preview</p><h1>Shop</h1>
      <p className="catalog-lede">Explore draft product names and proposed groupings. Product information, labels, imagery, classifications and availability are still under review.</p>
      <p className="catalog-draft-notice">Development preview · this is not a confirmed or purchasable catalogue.</p>
    </Container></section>
    <section className="catalog-section" aria-labelledby="collection-heading"><Container>
      <div className="catalog-section-heading"><div><p className="eyebrow">Draft groupings</p><h2 id="collection-heading">Explore by collection</h2></div><p>Proposed categories and their product membership require approval.</p></div>
      <div className="catalog-collection-grid">{discoverablePreviewCollections.map((collection) => <Link className="catalog-collection-tile" href={`/collections/${collection.slug}`} key={collection.slug}><span>Draft collection</span><strong>{collection.title}</strong><span className="catalog-collection-arrow" aria-hidden="true">↗</span></Link>)}</div>
    </Container></section>
    <section className="catalog-section catalog-products" aria-labelledby="preview-products-heading"><Container>
      <div className="catalog-section-heading"><div><p className="eyebrow">All products</p><h2 id="preview-products-heading">Shop the range</h2></div><p>Search, filter and sort the full Aram Narpavi range.</p></div>
      <Suspense fallback={<CatalogProductsFallback />}><CatalogProducts /></Suspense>
    </Container></section>
  </main>;
}
