import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";

export function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-heading">
      <Container className="final-cta__inner">
        <div><p className="eyebrow">Aram Narpavi Herbals</p><h2 id="final-cta-heading">Find what fits your routine.</h2></div>
        <div className="final-cta__copy"><p>Explore the range and review verified product information before ordering.</p></div>
        <TextLink className="button button--light" href="/shop">Browse all products <span aria-hidden="true">↗</span></TextLink>
      </Container>
    </section>
  );
}
