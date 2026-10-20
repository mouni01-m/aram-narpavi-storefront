import Link from "next/link";
import { CatalogBrowser } from "@/components/collections/catalog-browser";
import { Container } from "@/components/ui/container";
import { catalogPreviewProducts, discoverablePreviewCollections, getPreviewCollection } from "@/lib/content/catalog-preview";

export function CollectionPreviewPage({ slug }: { slug: string }) {
  const collection = getPreviewCollection(slug);
  if (!collection) return null;
  const products = catalogPreviewProducts.filter((product) => product.collectionSlug === slug && product.membershipStatus === "proposed");

  return <main id="main-content" tabIndex={-1} className="catalog-page">
    <section className="catalog-intro"><Container>
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><Link href="/shop">Shop preview</Link><span aria-current="page">{collection.title}</span></nav>
      <p className="eyebrow">Proposed collection · draft classification</p><h1>{collection.title}</h1>
      <p className="catalog-lede">{collection.introduction}</p>
      <p className="catalog-draft-notice">Development preview · collection name and product membership are not approved catalogue facts.</p>
      <Link className="text-link" href="/shop">← Back to all preview names</Link>
    </Container></section>
    <section className="catalog-section catalog-products" aria-labelledby="collection-products-heading"><Container>
      <div className="catalog-section-heading"><div><p className="eyebrow">Local sample data</p><h2 id="collection-products-heading">Preview names</h2></div><p>Only provisional sample membership is shown here. No purchase actions are available.</p></div>
      <CatalogBrowser products={products} categories={discoverablePreviewCollections} fixedCategory={slug} />
    </Container></section>
  </main>;
}
