import type { Metadata, Viewport } from "next";
import SiteShell from "@/components/layout/SiteShell";
import JsonLd from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/metadata";
import { homePageSchema } from "@/lib/seo/schema";
import { SITE_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Home",
    description: `${SITE_DESCRIPTION} Located in Asilmetta, Visakhapatnam. Premium gym with personal training, membership plans from ₹2,999/month.`,
    path: "/",
  }),
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/brand/be-strong-logo.png", type: "image/png" }],
    apple: [{ url: "/brand/be-strong-logo.png", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body>
        <JsonLd data={homePageSchema()} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
