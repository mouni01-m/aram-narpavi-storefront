import Link from "next/link";
import { Container } from "@/components/ui/container";

export function OfferStatus() {
  return (
    <section className="offer-status" aria-labelledby="offer-status-heading">
      <Container className="offer-status__inner">
        <div><p className="eyebrow">Special offers</p><h2 id="offer-status-heading">Clear prices come first.</h2></div>
        <p>Individual offers and product combos will be listed after prices and availability are verified. No promotional pricing is active in this preview.</p>
        <Link className="text-link" href="/shop">Browse the product preview <span aria-hidden="true">→</span></Link>
      </Container>
    </section>
  );
}
