import { ContactFormPreview } from "@/components/information/contact-form-preview";
import { InformationHero } from "@/components/information/information-hero";
import { SocialLinks } from "@/components/layout/social-links";
import { Container } from "@/components/ui/container";
import { contactDetails, createDraftMetadata, primaryPhoneHref, whatsappHref } from "@/lib/content/information-pages";

export const metadata = createDraftMetadata("Contact", "Contact Aram Narpavi Herbals by phone, email or WhatsApp for product and order enquiries. The website contact form is not enabled.");

export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1} className="information-page">
      <InformationHero eyebrow="Customer support" title="Contact Aram Narpavi Herbals" introduction="For product and order enquiries, contact our team using the details below." notice="The email and WhatsApp number are owner-provided. The role of the additional phone number has not been confirmed. The contact form cannot send messages." />
      <Container className="contact-layout">
        <section className="contact-details" aria-labelledby="contact-details-heading">
          <p className="eyebrow">Support details</p>
          <h2 id="contact-details-heading">Contact details</h2>
          <p>Email and WhatsApp are available for product and order enquiries. No response-time or business-hours commitment is stated.</p>
          <dl>
            <div><dt>Phone</dt><dd><a href={primaryPhoneHref}>{contactDetails.whatsapp}</a></dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></dd></div>
            <div><dt>WhatsApp</dt><dd><a href={whatsappHref} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></dd></div>
            <div><dt>Additional phone</dt><dd><a href={`tel:${contactDetails.additionalPhone.replace(/\s/g, "")}`}>{contactDetails.additionalPhone}</a></dd></div>
          </dl>
          <p className="contact-social-label">Follow Aram Narpavi Herbals</p>
          <SocialLinks />
        </section>
        <section aria-labelledby="contact-form-heading">
          <p className="eyebrow">Form preview</p>
          <h2 id="contact-form-heading">Send a message</h2>
          <p className="contact-form-intro">The fields show the intended accessible form structure. They remain disabled until a delivery provider, server validation, spam safeguards and privacy wording are approved.</p>
          <ContactFormPreview />
        </section>
      </Container>
    </main>
  );
}
