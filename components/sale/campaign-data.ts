import "server-only";

import { getSaleSnapshot } from "@/components/sale/get-sale-snapshot";
import { formatRupees, isPromotionLive, type Promotion } from "@/lib/commerce/pricing";
import { heritageSaleCampaign, promotions } from "@/lib/commerce/sale-config";

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", timeZone: "Asia/Kolkata" });

function discountLabel(promotion: Promotion) {
  return promotion.discount.type === "percentage" ? `${promotion.discount.percent}% off` : `${formatRupees(promotion.discount.amount)} off`;
}

/** Everything the campaign page needs, resolved once per request on the server. */
export async function getCampaignView() {
  const snapshot = await getSaleSnapshot();
  const now = Date.now();
  const live = snapshot.campaignState === "active" ? promotions.filter((promotion) => isPromotionLive(promotion, now) && promotion.couponCode === null) : [];
  const eligibleIds = new Set(live.flatMap((promotion) => promotion.productIds.filter((id) => !promotion.excludedProductIds.includes(id))));
  const { startsAt, endsAt } = heritageSaleCampaign;
  return {
    snapshot,
    state: snapshot.campaignState,
    startsAt,
    endsAt,
    startLabel: startsAt ? dateFormat.format(new Date(startsAt)) : null,
    endLabel: endsAt ? dateFormat.format(new Date(endsAt)) : null,
    liveOffers: live.map((promotion) => ({ id: promotion.id, title: promotion.title, label: discountLabel(promotion), copy: promotion.customerCopy })),
    eligibleProductCount: snapshot.products.filter((product) => eligibleIds.has(product.id)).length,
    featuredProductId: heritageSaleCampaign.featuredProductId ?? null,
  };
}

export type CampaignView = Awaited<ReturnType<typeof getCampaignView>>;
