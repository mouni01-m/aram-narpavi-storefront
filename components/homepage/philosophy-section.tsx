import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/homepage/section-heading";
import { homepageContent } from "@/lib/content/homepage";
import { imageAssets } from "@/lib/content/image-assets";
import { getOptionalImage } from "@/lib/content/optional-image";
import { OptionalImage } from "@/components/ui/optional-image";

export function PhilosophySection() {
  const storyImage = getOptionalImage(imageAssets.home.story);
  return (
    <Section className="philosophy-section" id="philosophy" aria-labelledby="philosophy-heading">
      <Container className="philosophy-grid">
        <div className="philosophy-marker" aria-hidden="true">
          {storyImage ? <OptionalImage src={storyImage} alt="" sizes="(max-width: 700px) 100vw, 40vw" /> : null}
          <span>ARAM</span>
          <span>NARPAVI</span>
          <span>HERBALS</span>
          <i />
        </div>
        <div className="philosophy-copy">
          <p className="eyebrow">Our approach · copy preview</p>
          <SectionHeading id="philosophy-heading" title={homepageContent.philosophy.heading} />
          <p>{homepageContent.philosophy.body}</p>
          <p className="preview-note">Brand story draft · owner approval pending</p>
        </div>
      </Container>
    </Section>
  );
}
