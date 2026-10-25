import Link from "next/link";
import { SectionHeading } from "@/components/homepage/section-heading";
import { Container } from "@/components/ui/container";
import { OptionalImage } from "@/components/ui/optional-image";
import { Section } from "@/components/ui/section";
import { catalogPreviewProducts, previewCollections } from "@/lib/content/catalog-preview";
import { imageAssets } from "@/lib/content/image-assets";
import { getListedProducts } from "@/lib/commerce/sale-catalog";

function describe(names: readonly string[]) {
  if (!names.length) return "Classification and intended use are under review.";
  return names.length > 3 ? `${names.slice(0, 3).join(", ")} and ${names.length - 3} more` : names.join(", ");
}

/** Editorial collection tiles: photo-led, with title, one-line contents and a product count. */
export function SaleCollections() {
  const listed = getListedProducts(catalogPreviewProducts);
  return (
    <Section className="home-section sale-collections" id="categories" aria-labelledby="sale-collections-heading">
      <Container>
        <SectionHeading id="sale-collections-heading" eyebrow="Shop by collection" title="Find your everyday essentials" />
        <ul className="sale-collection-grid" role="list">
          {previewCollections.map((collection, index) => {
            const names = listed.filter((product) => product.collectionSlug === collection.slug).map((product) => product.name);
            return (
              <li key={collection.slug}>
                <Link className="sale-collection-card" href={`/collections/${collection.slug}`}>
                  <div className="sale-collection-card__media">
                    <OptionalImage src={imageAssets.categories[collection.slug]} alt="" sizes="(max-width: 430px) 92vw, (max-width: 1000px) 46vw, 24vw" />
                  </div>
                  <div className="sale-collection-card__body">
                    <span className="sale-collection-card__index" aria-hidden="true">0{index + 1}</span>
                    <h3>{collection.title}</h3>
                    <span className="sale-collection-card__description">{describe(names)}</span>
                    <span className="sale-collection-card__meta">
                      {names.length ? `${names.length} ${names.length === 1 ? "product" : "products"}` : "No products listed yet"}
                      <span className="sale-collection-card__browse">Browse <span aria-hidden="true">→</span></span>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
