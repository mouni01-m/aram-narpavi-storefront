import { SectionHeading } from "@/components/homepage/section-heading";
import { CollectionCard } from "@/components/sale/collection-card";
import { saleSectionFont } from "@/components/sale/section-font";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { catalogPreviewProducts, previewCollections } from "@/lib/content/catalog-preview";
import { imageAssets } from "@/lib/content/image-assets";
import { getListedProducts } from "@/lib/commerce/sale-catalog";

function describe(names: readonly string[]) {
  if (!names.length) return "Classification and intended use are under review.";
  return names.length > 3 ? `${names.slice(0, 3).join(", ")} and ${names.length - 3} more` : names.join(", ");
}

/** Bordered collection grid: transparent product groupings, centred titles, contents, count and Explore. */
export function SaleCollections() {
  const listed = getListedProducts(catalogPreviewProducts);
  return (
    <Section className={`home-section sale-collections ${saleSectionFont.variable}`} id="categories" aria-labelledby="sale-collections-heading">
      <Container>
        <SectionHeading id="sale-collections-heading" eyebrow="Shop by collection" title="Find your everyday essentials" align="center" />
        <ul className="sale-collection-grid" role="list">
          {previewCollections.map((collection) => {
            const names = listed.filter((product) => product.collectionSlug === collection.slug).map((product) => product.name);
            return (
              <li key={collection.slug}>
                <CollectionCard
                  href={`/collections/${collection.slug}`}
                  title={collection.title}
                  image={imageAssets.collectionCutouts[collection.slug]}
                  description={describe(names)}
                  count={names.length ? `${names.length} ${names.length === 1 ? "product" : "products"}` : "No products listed yet"}
                />
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
