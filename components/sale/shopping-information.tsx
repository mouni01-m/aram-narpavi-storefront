import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { contactDetails } from "@/lib/content/information-pages";
import { saleContent } from "@/lib/content/sale";

const policyLinks = [
  { href: "/delivery-policy", label: "Delivery policy" },
  { href: "/refund-policy", label: "Refund policy" },
  { href: "/cancellation-policy", label: "Cancellation policy" },
  { href: "/faq", label: "Frequently asked questions" },
  { href: "/contact", label: "Contact us" },
];

export function ShoppingInformation() {
  return (
    <section className="shopping-information" aria-labelledby="shopping-information-heading">
      <Container className="shopping-information__inner">
        <div className="shopping-information__media">
          <Image src="/images/about/traditional-preparation.webp" alt="Dried herbs, petals and spices in bowls beside a stone mortar and pestle" fill sizes="(max-width: 800px) 100vw, 45vw" />
        </div>
        <div className="shopping-information__copy">
          <p className="eyebrow">Nature’s Purity, Tradition’s Healing</p>
          <h2 id="shopping-information-heading">{saleContent.information.heading}</h2>
          <p>{saleContent.information.copy}</p>
          <nav aria-label="Shopping information">
            <ul className="shopping-information__links">
              {policyLinks.map((link) => <li key={link.href}><Link href={link.href}>{link.label}<span aria-hidden="true">→</span></Link></li>)}
            </ul>
          </nav>
          <p className="shopping-information__support">
            Questions before you order? Email <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a> or message us on <a href="https://wa.me/919585304545" target="_blank" rel="noreferrer">WhatsApp {contactDetails.whatsapp}</a>.
          </p>
        </div>
      </Container>
    </section>
  );
}
