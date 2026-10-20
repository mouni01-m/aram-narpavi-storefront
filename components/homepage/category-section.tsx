import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/homepage/section-heading";
import { homepageContent } from "@/lib/content/homepage";
import Link from "next/link";
import { discoverablePreviewCollections } from "@/lib/content/catalog-preview";
import { imageAssets } from "@/lib/content/image-assets";
import { getOptionalImage } from "@/lib/content/optional-image";
import { OptionalImage } from "@/components/ui/optional-image";

export function CategorySection() {
  return (
    <Section className="home-section" id="categories" aria-labelledby="category-heading">
      <Container>
        <SectionHeading id="category-heading" eyebrow="Explore by collection" title="Find your everyday essentials" />
        <p className="preview-note">Browse by product type. Collection labels and product membership remain provisional until verified against the catalogue.</p>
        <div className="category-grid">
        {homepageContent.categories.filter((category) => category.style !== "oils").map((category, index) => {
            const collection = discoverablePreviewCollections[index];
            return <Link className={`category-tile category-tile--${category.style}`} href={`/collections/${collection.slug}`} key={category.name}>
              {getOptionalImage(imageAssets.categories[collection.slug as keyof typeof imageAssets.categories]) ? <OptionalImage src={imageAssets.categories[collection.slug as keyof typeof imageAssets.categories]} alt={`${category.name} collection`} sizes="(max-width: 430px) 90vw, (max-width: 900px) 45vw, 24vw" /> : null}
              <span className="category-tile__number">0{index + 1}</span>
              <div>
                <h3>{category.name}</h3>
                <p>{category.intro}</p>
                <span className="category-review">Draft preview · review pending</span>
              </div>
            </Link>;
          })}
        </div>
      </Container>
    </Section>
  );
}
