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
    <main id="main-content" tabIndex={-1} className="information-page about-page">
      <InformationHero eyebrow="Our brand direction" title={aboutContent.title} introduction={aboutContent.introduction} notice="This positioning copy awaits owner approval. No brand-history, sourcing, manufacturing or certification claims are included." />
      <section className="about-story-band" aria-labelledby="about-philosophy-heading">
        <Container>
          <div className="about-story">
            <figure className="about-story__media">
              {storyImage ? <OptionalImage src={storyImage} alt="Aram Narpavi Herbals brand-story image" sizes="(max-width: 700px) 100vw, 45vw" /> : <div className="about-story__placeholder" aria-hidden="true"><span>ARAM</span><span>NARPAVI</span></div>}
              <figcaption>{storyImage ? "Nature’s Purity, Tradition’s Healing" : "Brand photography pending"}</figcaption>
            </figure>
            <div className="about-story__copy">
              <p className="eyebrow">Brand positioning</p>
              <h2 id="about-philosophy-heading">{aboutContent.tagline}</h2>
              <p>{aboutContent.philosophy}</p>
              <p className="content-qualification">This is intended brand positioning rather than a claim about ingredients, sourcing, production methods or product performance.</p>
            </div>
          </div>
        </Container>
      </section>
      <section className="about-values" aria-labelledby="about-values-heading">
        <Container>
          <div className="about-values__heading">
            <p className="eyebrow">Values in development</p>
            <h2 id="about-values-heading">How the storefront should feel</h2>
          </div>
          <div className="about-values-grid">
            {aboutContent.values.map((value, index) => (
              <article key={value.title}>
                <span className="about-values-grid__badge" aria-hidden="true">{index + 1}</span>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <section className="about-cta" aria-labelledby="about-shop-heading">
        <Container>
          <div className="about-cta__inner">
            <div>
              <p className="eyebrow">Explore the preview</p>
              <h2 id="about-shop-heading">See the developing range</h2>
            </div>
            <Link className="button" href="/shop">Visit Shop preview</Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
