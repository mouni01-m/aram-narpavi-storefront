import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CartProvider } from "@/components/cart/cart-provider";
import { Ga4Consent } from "@/components/analytics/ga4-consent";
import { getSiteUrl } from "@/lib/config/site-url";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Aram Narpavi Herbals",
  description: "Explore the Aram Narpavi Herbals product preview, featuring herbal soaps and pantry favourites.",
  openGraph: {
    type: "website",
    siteName: "Aram Narpavi Herbals",
    title: "Aram Narpavi Herbals | Everyday rituals",
    description: "Explore the developing Aram Narpavi Herbals range.",
    ...(siteUrl ? { images: [{ url: "/images/social/og-homepage.webp", width: 1200, height: 630, alt: "Aram Narpavi Herbals" }] } : {}),
  },
  twitter: { card: "summary_large_image", ...(siteUrl ? { images: ["/images/social/og-homepage.webp"] } : {}) },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <CartProvider>
          <Ga4Consent measurementId={process.env.GA4_MEASUREMENT_ID} />
          <SiteHeader />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
