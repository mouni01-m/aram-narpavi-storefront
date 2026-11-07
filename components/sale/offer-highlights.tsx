import type { CampaignView } from "@/components/sale/campaign-data";
import { Container } from "@/components/ui/container";

/** Three-part offer strip. Every figure comes from configuration or catalogue data. */
export function OfferHighlights({ view }: { view: CampaignView }) {
  const { snapshot } = view;
  const comboOffers = snapshot.bundles.filter((offer) => offer.kind === "priced" || offer.kind === "illustrative");
  const bestCombo = Math.max(0, ...comboOffers.map((offer) => offer.discountPercent));
  const combosArePreview = comboOffers.length > 0 && comboOffers.every((offer) => offer.kind === "illustrative");
  const collectionCount = new Set(snapshot.products.map((product) => product.collectionSlug).filter(Boolean)).size;

  const blocks = [
    {
      id: "favourites",
      title: "Selected favourites",
      body: view.state === "active" && view.liveOffers.length
        ? `${view.liveOffers.map((offer) => offer.label).join(" · ")} on ${view.eligibleProductCount} eligible ${view.eligibleProductCount === 1 ? "product" : "products"}.`
        : "Special prices on selected products will appear here once approved.",
      tag: view.state === "active" ? null : "Coming soon",
      href: "#sale-products",
    },
    {
      id: "combos",
      title: "Curated combos",
      body: bestCombo > 0
        ? `Save up to ${bestCombo}% on ${comboOffers.length} combinations, with savings shown against buying separately.`
        : "Discover product combinations from across the range.",
      tag: combosArePreview ? "Preview pricing" : null,
      href: "#combos",
    },
    {
      id: "discovery",
      title: "Easy discovery",
      body: `Browse ${snapshot.products.length} products across ${collectionCount} collections, with search, filters and sorting.`,
      tag: null,
      href: "#categories",
    },
  ];

  return (
    <section className="offer-highlights" aria-label="Heritage Sale highlights">
      <Container>
        <ol className="offer-highlights__list">
          {blocks.map((block, index) => (
            <li key={block.id}>
              <a className="offer-highlights__item" href={block.href}>
                <span className="offer-highlights__index" aria-hidden="true">0{index + 1}</span>
                <span className="offer-highlights__title">{block.title}{block.tag ? <span className="offer-highlights__tag">{block.tag}</span> : null}</span>
                <span className="offer-highlights__body">{block.body}</span>
              </a>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
