import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BrandMark } from "@/components/layout/brand-mark";
import { contactDetails } from "@/lib/content/information-pages";

const INSTAGRAM_URL = "https://www.instagram.com/aramnarpaviherbals/";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-main">
          <div className="footer-brand-column">
            <BrandMark />
            <p className="footer-note">Nature's Purity, Tradition's Healing</p>
            <div className="footer-contact" aria-label="Contact details">
              <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
              <a href="https://wa.me/919585304545" target="_blank" rel="noreferrer">WhatsApp {contactDetails.whatsapp}</a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer noopener">Instagram @aramnarpaviherbals</a>
            </div>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <div><h2>Explore</h2><Link href="/shop">Shop</Link><Link href="/best-sellers">Bestsellers</Link><Link href="/combos">Combos & Gift Sets</Link><Link href="/heritage-sale">Heritage Sale</Link><Link href="/#categories">Collections</Link><Link href="/about">About</Link></div>
            <div><h2>Information</h2><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link><Link href="/delivery-policy">Delivery policy</Link><Link href="/refund-policy">Refund and returns</Link></div>
            <div><h2>Policies</h2><Link href="/cancellation-policy">Cancellation</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-and-conditions">Terms and conditions</Link></div>
          </nav>
        </div>
        <div className="footer-bottom"><span>Aram Narpavi Herbals</span><span>Product information will be added after verification.</span></div>
      </Container>
    </footer>
  );
}
