import Link from "next/link";
import { contactDetails, primaryPhoneHref } from "@/lib/content/information-pages";

export function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <p>
        Questions about a product or order? Call{" "}
        <a className="announcement-bar__phone" href={primaryPhoneHref}>{contactDetails.whatsapp}</a>
        {" "}or <Link href="/contact">contact our team</Link>
      </p>
    </div>
  );
}
