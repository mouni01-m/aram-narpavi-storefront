import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/homepage/section-heading";
import Link from "next/link";

const informationPoints = [
  { number: "01", title: "Product details", copy: "Ingredient and usage information will be added when verified against current approved labels." },
  { number: "02", title: "Delivery information", copy: "Delivery availability, charges and timing are not confirmed for this storefront yet." },
  { number: "03", title: "Customer support", copy: "Use the verified email and WhatsApp details on our Contact page for product and order enquiries." },
];

export function ProductInformation() {
  return (
    <Section className="home-section information-section" aria-labelledby="information-heading">
      <Container>
        <SectionHeading id="information-heading" eyebrow="Before you choose" title="Clear details come first" description="Product information is added only after it has been checked against approved labels and current records." />
        <div className="information-grid">
          {informationPoints.map((point) => (
            <article className="information-point" key={point.number}>
              <span>{point.number}</span>
              <div><h3>{point.title}</h3><p>{point.copy}</p></div>
            </article>
          ))}
        </div>
        <p className="information-contact-link"><Link className="text-link" href="/contact">Contact Aram Narpavi Herbals <span aria-hidden="true">→</span></Link></p>
      </Container>
    </Section>
  );
}
