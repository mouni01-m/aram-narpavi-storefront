import { ProductDetailPage } from "@/components/products/product-detail-page";
import { getProductPreviewMetadata } from "@/lib/content/product-preview-metadata";

export const metadata = getProductPreviewMetadata("instant-moringa-soup-mix");
export default function Page() { return <ProductDetailPage routeKey="instant-moringa-soup-mix" />; }
