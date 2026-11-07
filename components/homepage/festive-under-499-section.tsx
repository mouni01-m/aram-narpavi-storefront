import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { catalogPreviewProducts } from "@/lib/content/catalog-preview";

const PRICE_CEILING_INR = 499;
const HOMEPAGE_PRODUCT_COUNT = 4;

export function FestiveUnder499Section() {
  const products = catalogPreviewProducts
    .filter((product) => product.tentativePriceInr !== null && product.tentativePriceInr <= PRICE_CEILING_INR)
    .slice(0, HOMEPAGE_PRODUCT_COUNT);

  if (products.length === 0) return null;

  return (
    <Section className="home-section festive-section" id="festive" aria-labelledby="festive-heading">
      <Container>
        <div className="festive-section__header">
          <div>
            <p className="eyebrow">Festive shopping</p>
            <h2 id="festive-heading">Festive favourites under ₹499</h2>
            <p>Thoughtful herbal favourites for the festive season, chosen from our range under ₹499.</p>
          </div>
          <Link className="button festive-section__cta" href="/shop">Shop the collection <span aria-hidden="true">→</span></Link>
        </div>
        <div className="product-preview-grid">
          {products.map((product, index) => <ProductCard key={product.routeKey} product={product} index={index} />)}
        </div>
        <p className="festive-section__note">Prices shown are tentative and will be confirmed before ordering opens.</p>
      </Container>
    </Section>
  );
}
