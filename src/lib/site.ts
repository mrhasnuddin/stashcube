import type { Metadata } from "next";

// Production URL: set NEXT_PUBLIC_SITE_URL once a domain is attached; on Vercel it falls back to the production URL it provides.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
export const SITE_NAME = "Stashcube";
export const STUDIO_NAME = "DeanStudio";

const ALT = "Stashcube: tools and libraries for AI-native designers and builders";
// Landscape 1.91:1 is the standard link preview and goes first; the 1:1 one is for apps that prefer a square card.
export const OG_LANDSCAPE = { url: "/og/stashcube-og.png", width: 1200, height: 630, alt: ALT };
export const OG_SQUARE = { url: "/og/stashcube-og-square.png", width: 1200, height: 1200, alt: ALT };

type Image = { url: string; width: number; height: number; alt?: string };

// Page metadata with canonical, Open Graph and Twitter tags kept in agreement.
// openGraph and twitter are replaced (not merged) by a page, so every page goes through here.
export function pageMeta({
  title,
  description,
  path,
  images = [OG_LANDSCAPE, OG_SQUARE],
  absoluteTitle,
  noindex,
}: {
  title: string;
  description: string;
  path: string;
  images?: Image[];
  absoluteTitle?: boolean;
  noindex?: boolean;
}): Metadata {
  const shown = absoluteTitle ? title : `${title} · ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", url: path, title: shown, description, images },
    twitter: { card: "summary_large_image", title: shown, description, images: images.slice(0, 1) },
  };
}
