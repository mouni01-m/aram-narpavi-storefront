import { FaqList } from "@/components/information/faq-list";
import { InformationHero } from "@/components/information/information-hero";
import { Container } from "@/components/ui/container";
import { createDraftMetadata, faqGroups } from "@/lib/content/information-pages";

export const metadata = createDraftMetadata("Frequently Asked Questions", "Development FAQ covering current product-information status and the business decisions still awaiting approval.");

export default function FaqPage() {
  return (
    <main id="main-content" tabIndex={-1} className="information-page">
      <InformationHero eyebrow="Information and support" title="Frequently Asked Questions" introduction="Find the current status of product information, ordering, delivery, returns, cancellations and support." notice="Questions with unresolved operational answers are explicitly marked pending. They are not customer commitments." />
      <Container className="faq-page-layout"><FaqList groups={faqGroups} /></Container>
    </main>
  );
}
