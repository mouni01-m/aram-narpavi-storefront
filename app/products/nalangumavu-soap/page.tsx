import { ProductDetailPage } from "@/components/products/product-detail-page";
import { getProductPreviewMetadata } from "@/lib/content/product-preview-metadata";

export const metadata = getProductPreviewMetadata("nalangumavu-soap");
export default function Page() { return <ProductDetailPage routeKey="nalangumavu-soap" />; }
