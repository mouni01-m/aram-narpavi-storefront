import Link from "next/link";
import { Suspense } from "react";
import { CatalogProducts, CatalogProductsFallback } from "@/components/sale/catalog-products";
import { Container } from "@/components/ui/container";
import { getPreviewCollection } from "@/lib/content/catalog-preview";

export function CollectionPreviewPage({ slug }: { slug: string }) {
  const collection = getPreviewCollection(slug);
  if (!collection) return null;

  return <main id="main-content" tabIndex={-1} className="catalog-page">
    <section className="catalog-intro"><Container>
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><Link href="/shop">Shop preview</Link><span aria-current="page">{collection.title}</span></nav>
      <p className="eyebrow">Proposed collection · draft classification</p><h1>{collection.title}</h1>
      <p className="catalog-lede">{collection.introduction}</p>
      <p className="catalog-draft-notice">Development preview · collection name and product membership are not approved catalogue facts.</p>
      <Link className="text-link" href="/shop">← Back to all products</Link>
    </Container></section>
    <section className="catalog-section catalog-products" aria-labelledby="collection-products-heading"><Container>
      <div className="catalog-section-heading"><div><p className="eyebrow">{collection.title}</p><h2 id="collection-products-heading">Products in this collection</h2></div><p>Search and sort the products below.</p></div>
      <Suspense fallback={<CatalogProductsFallback />}><CatalogProducts collection={slug} /></Suspense>
    </Container></section>
  </main>;
}
