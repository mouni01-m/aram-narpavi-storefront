import { TextLink } from "@/components/ui/text-link";
import { homepageContent } from "@/lib/content/homepage";
import { imageAssets } from "@/lib/content/image-assets";
import { getOptionalImage } from "@/lib/content/optional-image";
import { OptionalImage } from "@/components/ui/optional-image";

export function HomepageHero() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="container home-hero__grid">
        <div className="home-hero__copy">
          <p className="eyebrow">Aram Narpavi Herbals</p>
          <h1 id="home-title">{homepageContent.hero.heading}</h1>
          <p className="home-hero__intro">{homepageContent.hero.supportingCopy}</p>
          <p className="home-hero__tagline">{homepageContent.hero.tagline}</p>
          <div className="cta-group">
            <TextLink className="button" href="/shop">Shop all products</TextLink>
            <TextLink className="text-link cta-secondary" href="/about">Discover our story <span aria-hidden="true">↗</span></TextLink>
          </div>
        </div>
        <figure className="hero-photo-placeholder">
          {getOptionalImage(imageAssets.home.hero) ? <OptionalImage src={imageAssets.home.hero} alt="Aram Narpavi Herbals product arrangement" sizes="(max-width: 700px) 100vw, 48vw" priority /> : null}
          <span className="hero-photo-placeholder__index">01 / BRAND IMAGERY</span>
          <span className="hero-photo-placeholder__frame" aria-hidden="true" />
          <figcaption>Nature’s Purity, Tradition’s Healing</figcaption>
        </figure>
      </div>
      <div className="home-hero__bottom-rule" aria-hidden="true" />
    </section>
  );
}
