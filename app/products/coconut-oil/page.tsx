import { ProductDetailPage } from "@/components/products/product-detail-page";
import { getProductPreviewMetadata } from "@/lib/content/product-preview-metadata";

export const metadata = getProductPreviewMetadata("coconut-oil");
export default function Page() { return <ProductDetailPage routeKey="coconut-oil" />; }
