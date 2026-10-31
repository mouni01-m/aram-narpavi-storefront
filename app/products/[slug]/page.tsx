import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/products/product-detail-page";
import { catalogPreviewProducts, getPreviewProduct } from "@/lib/content/catalog-preview";
import { getProductPreviewMetadata } from "@/lib/content/product-preview-metadata";

export function generateStaticParams() {
  return catalogPreviewProducts.map((product) => ({ slug: product.routeKey }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return getProductPreviewMetadata(slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getPreviewProduct(slug)) notFound();
  return <ProductDetailPage routeKey={slug} />;
}
