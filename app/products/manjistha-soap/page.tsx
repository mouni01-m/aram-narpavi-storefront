import { ProductDetailPage } from "@/components/products/product-detail-page";
import { getProductPreviewMetadata } from "@/lib/content/product-preview-metadata";

export const metadata = getProductPreviewMetadata("manjistha-soap");
export default function Page() { return <ProductDetailPage routeKey="manjistha-soap" />; }
