import Link from "next/link";
import { InformationHero } from "@/components/information/information-hero";
import { Container } from "@/components/ui/container";
import { aboutContent, createDraftMetadata } from "@/lib/content/information-pages";
import { imageAssets } from "@/lib/content/image-assets";
import { getOptionalImage } from "@/lib/content/optional-image";
import { OptionalImage } from "@/components/ui/optional-image";

export const metadata = createDraftMetadata("About", "Development draft introducing the Aram Narpavi Herbals brand direction and intended customer experience.");

export default function AboutPage() {
  const storyImage = getOptionalImage(imageAssets.home.story);
  return (
    <main id="main-content" tabIndex={-1} className="information-page">
      <InformationHero eyebrow="Our brand direction" title={aboutContent.title} introduction={aboutContent.introduction} notice="This positioning copy awaits owner approval. No brand-history, sourcing, manufacturing or certification claims are included." />
      <Container>
        <section className="about-story" aria-labelledby="about-philosophy-heading">
          <div className="about-story__marker">
            {storyImage ? <OptionalImage src={storyImage} alt="Aram Narpavi Herbals brand-story image" sizes="(max-width: 700px) 100vw, 40vw" /> : null}
            <span>ARAM</span><span>NARPAVI</span><i aria-hidden="true" />
            <small>{storyImage ? "Nature’s Purity, Tradition’s Healing" : "Brand photography pending"}</small>
          </div>
          <div>
            <p className="eyebrow">Brand positioning</p>
            <h2 id="about-philosophy-heading">{aboutContent.tagline}</h2>
            <p>{aboutContent.philosophy}</p>
            <p className="content-qualification">This is intended brand positioning rather than a claim about ingredients, sourcing, production methods or product performance.</p>
          </div>
        </section>
        <section className="about-values" aria-labelledby="about-values-heading">
          <p className="eyebrow">Values in development</p>
          <h2 id="about-values-heading">How the storefront should feel</h2>
          <div className="about-values-grid">{aboutContent.values.map((value, index) => <article key={value.title}><span aria-hidden="true">0{index + 1}</span><h3>{value.title}</h3><p>{value.body}</p></article>)}</div>
        </section>
        <section className="information-cta" aria-labelledby="about-shop-heading">
          <div><p className="eyebrow">Explore the preview</p><h2 id="about-shop-heading">See the developing range</h2></div>
          <Link className="button" href="/shop">Visit Shop preview</Link>
        </section>
      </Container>
    </main>
  );
}
