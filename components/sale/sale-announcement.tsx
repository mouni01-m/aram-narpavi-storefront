import Link from "next/link";
import { getSaleSnapshot } from "@/components/sale/get-sale-snapshot";
import { heritageSaleCampaign } from "@/lib/commerce/sale-config";
import { saleContent } from "@/lib/content/sale";

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

/** Campaign strip. On the homepage it links to the campaign page; on the campaign page, to its products. */
export async function SaleAnnouncement({ href = "/sale-products" }: { href?: string }) {
  const { campaignState } = await getSaleSnapshot();
  const { startsAt, endsAt } = heritageSaleCampaign;
  const copy = saleContent.campaign.announcement;
  const dates = campaignState === "active" && startsAt && endsAt
    ? ` · ${dateFormat.format(new Date(startsAt))} – ${dateFormat.format(new Date(endsAt))}`
    : campaignState === "upcoming" && startsAt ? ` · Opens ${dateFormat.format(new Date(startsAt))}` : "";
  return (
    <aside className="sale-announcement" aria-label="Heritage Sale announcement">
      <Link href={href}>{copy[campaignState]}{dates}<span aria-hidden="true"> →</span></Link>
    </aside>
  );
}

export function SaleAnnouncementFallback() {
  return <div className="sale-announcement" aria-hidden="true" />;
}
