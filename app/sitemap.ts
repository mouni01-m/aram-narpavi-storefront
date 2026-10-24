import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/config/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  // Do not publish invented canonical URLs; configure SITE_URL when the domain is confirmed.
  if (!base) return [];
  return [{ url: new URL("/", base).toString(), changeFrequency: "monthly", priority: 1 }];
}
