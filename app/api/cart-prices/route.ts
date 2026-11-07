import { getSaleSnapshot } from "@/components/sale/get-sale-snapshot";
import { buildCartPrices } from "@/lib/commerce/cart-pricing";

/** Display prices for the cart drawer. The cart stores no prices, so totals are always server-resolved. */
export async function GET() {
  const snapshot = await getSaleSnapshot();
  return Response.json(buildCartPrices(snapshot), { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
