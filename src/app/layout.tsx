import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  metadataBase: new URL("https://prestigeroutes.com"),
  title: {
    default: "Prestige Routes - Luxury tours & curated travel",
    template: "%s | Prestige Routes",
  },
  description:
    "Discover upcoming small-group journeys, book with secure checkout, and travel with Prestige Routes.",
  openGraph: {
    siteName: "Prestige Routes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col antialiased">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
