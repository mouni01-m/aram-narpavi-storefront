import { ProductDetailPage } from "@/components/products/product-detail-page";
import { getProductPreviewMetadata } from "@/lib/content/product-preview-metadata";

export const metadata = getProductPreviewMetadata("abc-malt");
export default function Page() { return <ProductDetailPage routeKey="abc-malt" />; }
