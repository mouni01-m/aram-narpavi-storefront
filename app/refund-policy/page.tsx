import { PolicyPage } from "@/components/information/policy-page";
import { createDraftMetadata } from "@/lib/content/information-pages";

export const metadata = createDraftMetadata("Refund and Return Policy", "Development outline of return, replacement and refund decisions awaiting approval.");
export default function Page() { return <PolicyPage pageKey="refund" />; }
