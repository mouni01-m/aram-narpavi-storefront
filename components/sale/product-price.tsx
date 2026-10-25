import { getSaleSnapshot } from "@/components/sale/get-sale-snapshot";
import { OfferPrice } from "@/components/sale/offer-price";

/** The same server-resolved price shown on product cards, for the product detail page. */
export async function ProductPrice({ productId }: { productId: string }) {
  const product = (await getSaleSnapshot()).products.find((candidate) => candidate.id === productId);
  return product ? <OfferPrice offer={product.offer} /> : null;
}
