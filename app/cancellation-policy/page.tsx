import { PolicyPage } from "@/components/information/policy-page";
import { createDraftMetadata } from "@/lib/content/information-pages";

export const metadata = createDraftMetadata("Cancellation Policy", "Development outline of cancellation terms awaiting operational and owner approval.");
export default function Page() { return <PolicyPage pageKey="cancellation" />; }
