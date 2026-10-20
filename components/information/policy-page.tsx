import Link from "next/link";
import { InformationHero } from "@/components/information/information-hero";
import { Container } from "@/components/ui/container";
import { policyPages, type PolicyPageKey } from "@/lib/content/information-pages";

export function PolicyPage({ pageKey }: { pageKey: PolicyPageKey }) {
  const page = policyPages[pageKey];
  return (
    <main id="main-content" tabIndex={-1} className="information-page">
      <InformationHero eyebrow={page.eyebrow} title={page.title} introduction={page.description} />
      <Container className="policy-layout">
        <aside className="policy-sidebar" aria-label="Policy status">
          <p className="eyebrow">Publication status</p>
          <p>Every section below records a decision that remains open. Owner, operational and appropriate legal review are required before publication.</p>
          <Link className="text-link" href="/contact">View contact-page status</Link>
        </aside>
        <div className="policy-sections">
          {page.sections.map((section, index) => (
            <section key={section.title} aria-labelledby={`${pageKey}-section-${index}`}>
              <span className="policy-section-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2 id={`${pageKey}-section-${index}`}>{section.title}</h2>
                <p><strong>Pending approval:</strong> {section.pendingDecision}</p>
              </div>
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
