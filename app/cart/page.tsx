import Link from "next/link";
import { CartExperience } from "@/components/cart/cart-experience";
import { DraftContentNotice } from "@/components/information/draft-content-notice";
import { Container } from "@/components/ui/container";
import { createDraftMetadata } from "@/lib/content/information-pages";

export const metadata = createDraftMetadata("Preview Cart", "Local development cart prototype for eligible Aram Narpavi Herbals product previews. Ordering and checkout are unavailable.");

export default function CartPage() {
  return (
    <main id="main-content" tabIndex={-1} className="cart-page">
      <header className="cart-hero"><Container>
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><Link href="/shop">Shop preview</Link><span aria-current="page">Preview cart</span></nav>
        <p className="eyebrow">Front-end prototype</p>
        <h1>Preview cart</h1>
        <p className="cart-hero__intro">Try local item and quantity controls using eligible development previews.</p>
        <DraftContentNotice>This cart exists only for interface testing. Products cannot be ordered, reserved or checked out.</DraftContentNotice>
      </Container></header>
      <Container className="cart-page-content"><CartExperience /></Container>
    </main>
  );
}
