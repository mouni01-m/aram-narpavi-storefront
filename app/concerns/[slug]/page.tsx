import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogProducts, CatalogProductsFallback } from "@/components/sale/catalog-products";
import { Container } from "@/components/ui/container";
import { concerns, getConcern } from "@/lib/content/concerns";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return concerns.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const concern = getConcern((await params).slug);
  return {
    title: `${concern?.title ?? "Shop by Concern"} | Aram Narpavi Herbals`,
    description: concern?.intro,
    robots: { index: false, follow: true },
  };
}

export default async function ConcernPage({ params }: Props) {
  const concern = getConcern((await params).slug);
  if (!concern) notFound();

  return <main id="main-content" tabIndex={-1} className="catalog-page">
    <section className="catalog-intro"><Container>
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><Link href="/shop">Shop preview</Link><span aria-current="page">{concern.title}</span></nav>
      <p className="eyebrow">Shop by concern</p><h1>{concern.title}</h1>
      <p className="catalog-lede">{concern.intro}</p>
      <p className="catalog-draft-notice">A browsing guide only. These products are not claimed to treat, cure or prevent any condition. Please see a doctor about any health concern.</p>
      <Link className="text-link" href="/shop">← Back to all products</Link>
    </Container></section>
    <section className="catalog-section catalog-products" aria-labelledby="concern-products-heading"><Container>
      <div className="catalog-section-heading"><div><p className="eyebrow">{concern.title}</p><h2 id="concern-products-heading">Products to explore</h2></div><p>Search and sort the products below.</p></div>
      <Suspense fallback={<CatalogProductsFallback />}><CatalogProducts productIds={concern.productIds} /></Suspense>
    </Container></section>
  </main>;
}
