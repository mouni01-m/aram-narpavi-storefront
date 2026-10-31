import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/homepage/section-heading";
import { getOptionalImage } from "@/lib/content/optional-image";
import { OptionalImage } from "@/components/ui/optional-image";

const INSTAGRAM_URL = "https://www.instagram.com/aramnarpaviherbals/";

const galleryImages = [
  { src: "/images/about/ingredients.webp", alt: "Natural herbal ingredients used in Aram Narpavi products" },
  { src: "/images/about/traditional-preparation.webp", alt: "Traditional preparation of herbal products" },
  { src: "/images/about/brand-story.webp", alt: "Aram Narpavi brand story" },
  { src: "/images/home/campaigns/diwali-goodness.webp", alt: "Aram Narpavi Diwali campaign with herbal products and festive lamps" },
  { src: "/images/home/hero-products.webp", alt: "Aram Narpavi herbal product range" },
  { src: "/images/categories/herbal-soaps.webp", alt: "Aram Narpavi herbal soaps" },
];

export function InstagramShowcase() {
  return (
    <Section className="home-section instagram-section" id="instagram" aria-labelledby="instagram-heading">
      <Container>
        <div className="instagram-header">
          <SectionHeading id="instagram-heading" eyebrow="Follow our journey" title="From Nature, With Care." />
          <a className="instagram-follow-link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer noopener">
            Follow on Instagram <span aria-hidden="true">→</span>
          </a>
        </div>
        <p className="section-description">
          See behind the scenes, product highlights and everyday rituals from Aram Narpavi Herbals.
        </p>
        <div className="instagram-grid">
          {galleryImages.map((image, index) => {
            const src = getOptionalImage(image.src);
            return (
              <a
                key={index}
                className="instagram-tile"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`View Aram Narpavi Herbals on Instagram — photo ${index + 1}`}
              >
                {src ? (
                  <OptionalImage src={src} alt={image.alt} sizes="(max-width: 430px) 45vw, (max-width: 900px) 30vw, 20vw" />
                ) : (
                  <span className="instagram-tile__placeholder">{image.alt}</span>
                )}
                <span className="instagram-tile__overlay" aria-hidden="true">
                  <span>Instagram</span>
                </span>
              </a>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
