import { PolicyPage } from "@/components/information/policy-page";
import { createDraftMetadata } from "@/lib/content/information-pages";

export const metadata = createDraftMetadata("Terms and Conditions", "Development terms structure awaiting owner, operational and appropriate legal review.");
export default function Page() { return <PolicyPage pageKey="terms" />; }
