import type { Metadata } from "next";
import { CollectionPreviewPage } from "@/components/collections/collection-page";
import { getPreviewCollection } from "@/lib/content/catalog-preview";

const collection = getPreviewCollection("pantry-essentials")!;
export const metadata: Metadata = { title: `${collection.title} preview | Aram Narpavi Herbals`, description: `${collection.introduction} Draft preview only; products and classifications are not confirmed.` };
export default function Page() { return <CollectionPreviewPage slug="pantry-essentials" />; }
