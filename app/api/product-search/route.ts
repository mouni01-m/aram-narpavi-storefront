import { getSaleSnapshot } from "@/components/sale/get-sale-snapshot";
import { buildSearchIndex } from "@/lib/commerce/product-search";
import { previewCollections } from "@/lib/content/catalog-preview";
import { collectionSearchKeywords, comboItemNotes, productSearchKeywords } from "@/lib/content/sale";

/** Search data for the header, fetched on first use so static pages stay static. */
export async function GET() {
  const { products } = await getSaleSnapshot();
  const index = buildSearchIndex(products, {
    collections: previewCollections,
    descriptions: comboItemNotes,
    collectionKeywords: collectionSearchKeywords,
    productKeywords: productSearchKeywords,
  });
  return Response.json({ products: index }, { headers: { "Cache-Control": "private, max-age=60", "X-Robots-Tag": "noindex" } });
}
