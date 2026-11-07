import Image from "next/image";
import { CampaignCountdown } from "@/components/sale/campaign-countdown";
import type { CampaignView } from "@/components/sale/campaign-data";
import { Container } from "@/components/ui/container";
import { getProductImages } from "@/lib/content/product-images";
import { saleContent } from "@/lib/content/sale";

const copy = saleContent.campaign.hero;

function OfferMessage({ view }: { view: CampaignView }) {
  if (view.state === "active") {
    return (
      <div className="campaign-hero__offer">
        {view.liveOffers.map((offer) => <p key={offer.id}><strong>{offer.label}</strong> · {offer.copy}</p>)}
        {view.endsAt ? <CampaignCountdown endsAt={view.endsAt} /> : null}
      </div>
    );
  }
  if (view.state === "upcoming") return <div className="campaign-hero__offer"><p>{copy.status.upcoming} <strong>{view.startLabel}</strong>.</p></div>;
  if (view.state === "ended") return <div className="campaign-hero__offer"><p>{copy.status.ended}</p></div>;
  return <div className="campaign-hero__offer campaign-hero__offer--preview"><p>{copy.status.preview}</p></div>;
}

export function CampaignHero({ view }: { view: CampaignView }) {
  // All three frames are genuine images from the central product-image registry.
  const [scene] = getProductImages("abc-malt");
  const [soap] = getProductImages("kuppameni-soap");
  const [honey] = getProductImages("honey");
  return (
    <section className="campaign-hero" id="sale" aria-labelledby="campaign-hero-heading">
      <Container className="campaign-hero__inner">
        <div className="campaign-hero__copy">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 id="campaign-hero-heading">
            {(view.state === "ended" ? copy.endedHeading : copy.heading).split(/(?<=\.)\s+/).map((line, index) => <span key={line}>{index ? " " : ""}{line}</span>)}
          </h1>
          <p className="campaign-hero__lede">{copy.copy}</p>
          <OfferMessage view={view} />
          <div className="campaign-hero__actions">
            <a className="button" href="#sale-products">{copy.primary}</a>
            <a className="button button--outline" href="#combos">{copy.secondary}</a>
          </div>
          <p className="campaign-hero__tagline">{copy.tagline}</p>
        </div>
        <div className="campaign-hero__visual">
          {scene ? (
            <figure className="campaign-hero__frame campaign-hero__frame--main">
              <Image src={scene.src} alt={scene.alt} fill priority sizes="(max-width: 900px) 92vw, 46vw" style={{ objectPosition: "94% 55%" }} />
            </figure>
          ) : null}
          {soap ? (
            <figure className="campaign-hero__frame campaign-hero__frame--inset campaign-hero__frame--a">
              <Image src={soap.src} alt={soap.alt} fill sizes="(max-width: 900px) 34vw, 16vw" />
            </figure>
          ) : null}
          {honey ? (
            <figure className="campaign-hero__frame campaign-hero__frame--inset campaign-hero__frame--b">
              <Image src={honey.src} alt={honey.alt} fill sizes="(max-width: 900px) 34vw, 16vw" />
            </figure>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
