import { formatRupees, type ProductOffer } from "@/lib/commerce/pricing";

const availabilityLabel = { "in-stock": "In stock", "out-of-stock": "Out of stock" } as const;

export function OfferPrice({ offer }: { offer: ProductOffer }) {
  if (offer.kind === "unpriced") {
    return <p className="offer-price offer-price--pending">Price and availability awaiting verification</p>;
  }
  if (offer.kind === "provisional") {
    return (
      <div className="offer-price">
        <p className="offer-price__row"><span className="offer-price__final"><span className="visually-hidden">Price </span>{formatRupees(offer.price)}</span></p>
        <p className="offer-price__stock">{offer.packSize}</p>
      </div>
    );
  }
  return (
    <div className="offer-price">
      <p className="offer-price__row">
        <span className="offer-price__final"><span className="visually-hidden">Price </span>{formatRupees(offer.finalPrice)}</span>
        {offer.originalPrice !== null ? <s className="offer-price__original"><span className="visually-hidden">Was </span>{formatRupees(offer.originalPrice)}</s> : null}
        {offer.discountPercent > 0 ? <span className="offer-price__badge">{offer.discountPercent}% off</span> : null}
      </p>
      {offer.savings > 0 ? <p className="offer-price__savings">You save {formatRupees(offer.savings)}</p> : null}
      {offer.mrp !== null && offer.originalPrice === null ? <p className="offer-price__mrp">MRP {formatRupees(offer.mrp)}</p> : null}
      <p className={`offer-price__stock offer-price__stock--${offer.availability}`}>{offer.packSize} · {availabilityLabel[offer.availability]}</p>
    </div>
  );
}
