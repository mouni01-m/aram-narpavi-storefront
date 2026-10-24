import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/homepage/section-heading";
import { homepageContent } from "@/lib/content/homepage";
import { imageAssets } from "@/lib/content/image-assets";
import { getOptionalImage } from "@/lib/content/optional-image";
import { BrandAdVideo } from "@/components/homepage/brand-ad-video";
import Link from "next/link";

export function PhilosophySection() {
  const storyImage = getOptionalImage(imageAssets.home.story);
  return (
    <Section className="philosophy-section" id="philosophy" aria-labelledby="philosophy-heading">
      <Container className="philosophy-grid">
        <div className="philosophy-copy">
          <p className="eyebrow">Traditional care · everyday rituals</p>
          <SectionHeading id="philosophy-heading" title={homepageContent.philosophy.heading} />
          <p>{homepageContent.philosophy.body}</p>
          <nav className="philosophy-actions" aria-label="Explore Aram Narpavi Herbals collections">
            <Link className="philosophy-action philosophy-action--primary" href="/collections/herbal-soaps">Explore herbal soaps <span aria-hidden="true">→</span></Link>
            <Link className="philosophy-action" href="/collections/pantry-essentials">Discover pantry favourites <span aria-hidden="true">→</span></Link>
          </nav>
        </div>
        <figure className="philosophy-device" aria-label="Aram Narpavi Herbals video advertisement">
          <span className="philosophy-device__speaker" aria-hidden="true" />
          <span className="philosophy-device__camera" aria-hidden="true" />
          <BrandAdVideo poster={storyImage ?? undefined} />
          <figcaption>Watch the Aram Narpavi Herbals brand story</figcaption>
        </figure>
      </Container>
    </Section>
  );
}
