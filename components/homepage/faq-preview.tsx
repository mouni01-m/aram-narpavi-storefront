import Link from "next/link";
import { SectionHeading } from "@/components/homepage/section-heading";
import { saleSectionFont } from "@/components/sale/section-font";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { homepageContent } from "@/lib/content/homepage";

export function FaqPreview() {
  return (
    <Section className={`home-section faq-section ${saleSectionFont.variable}`} id="faq-preview" aria-labelledby="faq-heading">
      <Container>
        <SectionHeading id="faq-heading" eyebrow="A few useful notes" title="Questions, answered carefully" description="Operational details remain marked pending until they are confirmed." align="center" />
        <div className="faq-list">
          {homepageContent.faqPreview.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}<span aria-hidden="true">+</span></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
        <p className="faq-preview-more"><Link className="faq-preview-link" href="/faq">Read all FAQs <span aria-hidden="true">→</span></Link></p>
      </Container>
    </Section>
  );
}
