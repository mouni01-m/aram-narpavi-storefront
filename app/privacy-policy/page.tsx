import { PolicyPage } from "@/components/information/policy-page";
import { createDraftMetadata } from "@/lib/content/information-pages";

export const metadata = createDraftMetadata("Privacy Policy", "Development privacy-policy structure awaiting a verified data-practices map and appropriate review.");
export default function Page() { return <PolicyPage pageKey="privacy" />; }
