import { getSaleSnapshot } from "@/components/sale/get-sale-snapshot";
import { SaleCatalog } from "@/components/sale/sale-catalog";
import { previewCollections } from "@/lib/content/catalog-preview";

/**
 * Product grid with images, prices, filters and cart actions, used by the homepage,
 * the shop and each collection page. Pass `collection` to lock it to one collection.
 */
export async function CatalogProducts({ collection, initialVisible }: { collection?: string; initialVisible?: number }) {
  const snapshot = await getSaleSnapshot();
  const products = collection ? snapshot.products.filter((product) => product.collectionSlug === collection) : snapshot.products;
  const collections = previewCollections
    .filter((option) => snapshot.products.some((product) => product.collectionSlug === option.slug))
    .map(({ slug, title }) => ({ slug, title }));
  return <SaleCatalog products={products} collections={collections} fixedCollection={collection} initialVisible={initialVisible} />;
}

export function CatalogProductsFallback() {
  return <div className="catalog-products-fallback" role="status"><span className="visually-hidden">Loading products</span></div>;
}
