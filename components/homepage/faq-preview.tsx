import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/homepage/section-heading";
import { homepageContent } from "@/lib/content/homepage";
import Link from "next/link";

export function FaqPreview() {
  return (
    <Section className="home-section faq-section" id="faq-preview" aria-labelledby="faq-heading">
      <Container className="faq-layout">
        <div>
          <SectionHeading id="faq-heading" eyebrow="A few useful notes" title="Questions, answered carefully" />
          <p className="preview-note">Operational details remain marked pending until they are confirmed.</p>
          <Link className="text-link faq-preview-link" href="/faq">Read all FAQs <span aria-hidden="true">→</span></Link>
        </div>
        <div className="faq-list">
          {homepageContent.faqPreview.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}<span aria-hidden="true">+</span></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
