import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree, Martian_Mono } from "next/font/google";
import "./globals.css";
import { PixelTexture } from "@/components/PixelTexture";
import { Sidebar } from "@/components/Sidebar";
import { STUDIO_URL } from "@/components/DeanStudioLink";
import { groupsWithCategories, totalCount } from "@/lib/content";
import { OG_LANDSCAPE, OG_SQUARE, SITE_NAME, SITE_URL, STUDIO_NAME } from "@/lib/site";

const heading = Bricolage_Grotesque({ subsets: ["latin"], variable: "--nf-heading", display: "swap" });
const body = Figtree({ subsets: ["latin"], variable: "--nf-body", display: "swap" });
const mono = Martian_Mono({ subsets: ["latin"], variable: "--nf-mono", display: "swap" });

// Defaults for every page. Pages override title, description, canonical and the share tags through pageMeta() in src/lib/site.ts.
const title = `${SITE_NAME}: tools for AI-native designers and builders`;
const description = `Tools and libraries for AI-native designers and builders, curated by ${STUDIO_NAME}: ${totalCount()} links across UI, 3D, icons, fonts, inspiration and AI skills.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s · ${SITE_NAME}` },
  description,
  applicationName: SITE_NAME,
  keywords: ["design tools", "UI libraries", "AI skills", "icons", "fonts", "3D tools", "web design inspiration", "AI-native designers"],
  authors: [{ name: STUDIO_NAME, url: STUDIO_URL }],
  creator: STUDIO_NAME,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", url: "/", title, description, images: [OG_LANDSCAPE, OG_SQUARE] },
  twitter: { card: "summary_large_image", title, description, images: [OG_LANDSCAPE] },
};

// Matches the page background (--color-background) so the browser chrome does not flash light.
export const viewport: Viewport = { themeColor: "#0A0A0A", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  const groups = groupsWithCategories().map((g) => ({
    slug: g.slug,
    name: g.name,
    categories: g.categories.map((c) => ({ slug: c.slug, name: c.name, hasNew: c.hasNew })),
  }));
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <div className="app">
          <Sidebar groups={groups} />
          <main>
            <PixelTexture />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
