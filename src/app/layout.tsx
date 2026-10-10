import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, Martian_Mono } from "next/font/google";
import "./globals.css";
import { PixelTexture } from "@/components/PixelTexture";
import { Sidebar } from "@/components/Sidebar";
import { groupsWithCategories, totalCount } from "@/lib/content";

const heading = Bricolage_Grotesque({ subsets: ["latin"], variable: "--nf-heading", display: "swap" });
const body = Figtree({ subsets: ["latin"], variable: "--nf-body", display: "swap" });
const mono = Martian_Mono({ subsets: ["latin"], variable: "--nf-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Stashcube", template: "%s · Stashcube" },
  description: `A public library of ${totalCount()} links: UI libraries, 3D tools, icons, fonts and design inspiration.`,
  openGraph: { siteName: "Stashcube", type: "website" },
};

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
