import { ProductDetailPage } from "@/components/products/product-detail-page";
import { getProductPreviewMetadata } from "@/lib/content/product-preview-metadata";

export const metadata = getProductPreviewMetadata("karuppu-kavuni-kanji-mix");
export default function Page() { return <ProductDetailPage routeKey="karuppu-kavuni-kanji-mix" />; }
