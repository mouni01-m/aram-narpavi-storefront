import Link from "next/link";
import { Container } from "@/components/ui/container";

export function CombosBand() {
  return (
    <section className="combos-band" aria-labelledby="combos-band-heading">
      <Container className="combos-band__inner">
        <div>
          <p className="eyebrow">Combos & gift sets</p>
          <h2 id="combos-band-heading">Bundles are coming soon.</h2>
          <p>Combo contents and prices will be shown here once they are confirmed. No bundle offers are active yet.</p>
        </div>
        <Link className="button combos-band__cta" href="/combos">View combo plans <span aria-hidden="true">→</span></Link>
      </Container>
    </section>
  );
}
