import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Combos & Gift Sets | Aram Narpavi Herbals",
  description: "Explore combo and gift set options from Aram Narpavi Herbals. Bundle details, pricing and savings will be shown once verified.",
  alternates: { canonical: "/combos" },
  robots: { index: false, follow: true },
};

const comboCategories = [
  {
    name: "Personal Care Combos",
    description: "Curated herbal soap and personal-care pairings for everyday routines.",
    status: "Coming soon",
  },
  {
    name: "Soap Combos",
    description: "Multi-bar soap sets featuring selected herbal soap varieties.",
    status: "Coming soon",
  },
  {
    name: "Hair Care Combos",
    description: "Herbal hair oils and balms grouped for complete care routines.",
    status: "Coming soon",
  },
  {
    name: "Pantry & Food Bundles",
    description: "Traditional mixes and pantry favourites bundled for everyday use.",
    status: "Coming soon",
  },
  {
    name: "Gift Sets",
    description: "Thoughtful gift combinations for festive and everyday gifting.",
    status: "Coming soon",
  },
];

export default function CombosPage() {
  return (
    <main id="main-content" tabIndex={-1} className="catalog-page">
      <section className="catalog-intro">
        <Container>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-current="page">Combos & Gift Sets</span>
          </nav>
          <p className="eyebrow">Bundles and gift sets</p>
          <h1>Combos & Gift Sets</h1>
          <p className="catalog-lede">
            Discover curated combinations of Aram Narpavi Herbals products.
            Bundle pricing, included products and verified savings will appear once approved.
          </p>
          <p className="catalog-draft-notice">
            Combo data pending · bundle prices, included items and savings require business verification.
            Discounts will not exceed 15% per the approved offer policy.
          </p>
        </Container>
      </section>
      <section className="catalog-section" aria-labelledby="combo-categories-heading">
        <Container>
          <div className="catalog-section-heading">
            <div>
              <p className="eyebrow">Planned categories</p>
              <h2 id="combo-categories-heading">Explore combo categories</h2>
            </div>
            <p>Each category will list verified bundles with real product contents and pricing.</p>
          </div>
          <div className="combo-category-grid">
            {comboCategories.map((category) => (
              <article key={category.name} className="combo-category-card">
                <span className="combo-category-status">{category.status}</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </article>
            ))}
          </div>
          <p className="catalog-more-link">
            <Link className="text-link" href="/shop">Browse individual products →</Link>
          </p>
        </Container>
      </section>
    </main>
  );
}
