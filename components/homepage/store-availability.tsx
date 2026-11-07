import Image from "next/image";
import Link from "next/link";
import { PlatformMarquee } from "@/components/homepage/platform-marquee";
import { Reveal } from "@/components/homepage/reveal";
import { SectionHeading } from "@/components/homepage/section-heading";
import { saleSectionFont } from "@/components/sale/section-font";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { onlinePlatforms, storeAvailability } from "@/lib/content/homepage";

export function StoreAvailability() {
  const { image, cities } = storeAvailability;
  return (
    <>
      <Section className={`home-section store-section ${saleSectionFont.variable}`} aria-labelledby="store-heading">
        <Container>
          <SectionHeading id="store-heading" title={storeAvailability.sectionTitle} align="center" />
          <Reveal className="store-card">
            <div className="store-card__photo">
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 860px) 92vw, 46vw" />
            </div>
            <div className="store-card__body">
              <h3>{storeAvailability.heading}</h3>
              <ul className="store-card__cities">
                {cities.map((city) => <li key={city}>{city}</li>)}
              </ul>
              <Link className="button store-card__action" href={storeAvailability.locatorHref}>{storeAvailability.actionLabel}</Link>
              <p className="store-card__note">{storeAvailability.note}</p>
            </div>
          </Reveal>
        </Container>
      </Section>
      <Section className={`home-section online-section ${saleSectionFont.variable}`} aria-labelledby="online-heading">
        <Container>
          <SectionHeading id="online-heading" title={storeAvailability.onlineTitle} description={storeAvailability.onlineSubtitle} align="center" />
          <Reveal>
            <PlatformMarquee platforms={onlinePlatforms} />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
