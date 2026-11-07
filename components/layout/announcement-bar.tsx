import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <p>Questions about a product or order? <Link href="/contact">Contact our team</Link></p>
    </div>
  );
}
