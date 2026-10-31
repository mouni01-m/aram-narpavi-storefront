import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/config/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  // Do not publish invented canonical URLs; configure SITE_URL when the domain is confirmed.
  if (!base) return [];
  const routes = ["/", "/shop", "/best-sellers", "/combos", "/about", "/contact", "/faq"];
  return routes.map((route) => ({
    url: new URL(route, base).toString(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
