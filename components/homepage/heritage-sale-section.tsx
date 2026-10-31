import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/homepage/section-heading";
import { imageAssets } from "@/lib/content/image-assets";
import { getOptionalImage } from "@/lib/content/optional-image";
import { OptionalImage } from "@/components/ui/optional-image";
import Link from "next/link";

export function HeritageSaleSection() {
  const banner = getOptionalImage("/images/banners/festival-banner.webp");
  return (
    <Section className="home-section heritage-sale-section" id="heritage-sale" aria-labelledby="heritage-sale-heading">
      <Container>
        <div className="heritage-sale-banner">
          {banner ? (
            <OptionalImage src={banner} alt="Aram Narpavi Heritage Sale campaign" sizes="(max-width: 700px) 100vw, 80vw" />
          ) : null}
          <div className="heritage-sale-banner__overlay">
            <p className="eyebrow">Heritage Sale · Limited time</p>
            <SectionHeading id="heritage-sale-heading" title="Natural favourites, thoughtfully priced." />
            <p className="heritage-sale-banner__text">
              Explore selected herbal and pantry favourites during the Heritage Sale.
              Verified savings shown on eligible products. Discounts will not exceed 15%.
            </p>
            <Link className="button heritage-sale-banner__cta" href="/heritage-sale">
              Explore the Heritage Sale <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
