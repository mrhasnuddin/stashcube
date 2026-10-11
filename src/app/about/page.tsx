import type { Metadata } from "next";
import { DeanStudioLink } from "@/components/DeanStudioLink";
import { PageHeader } from "@/components/PageHeader";
import { totalCount } from "@/lib/content";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({ title: "About", description: "Why Stashcube exists and how the links are kept.", path: "/about" });

export default function AboutPage() {
  return (
    <>
      <PageHeader trail={[{ label: "About" }]} />
      <div className="page-head">
        <span className="label">About</span>
        <h1>Why this exists</h1>
      </div>
      <div className="prose">
        <p>
          Stashcube is a curated library of tools, libraries and references for AI-native designers and builders. If you design and build with AI and coding isn&apos;t your
          strongest skill, this is where to find the parts that do the heavy lifting. Curated by <DeanStudioLink />.
        </p>
        <p>
          The links are sorted by what they are for, so starting a project means picking a category instead of searching from scratch. There are {totalCount()} so far.
        </p>
        <h2>How to use it</h2>
        <p>
          Pick a category in the sidebar, narrow it with tags, or press / to search the whole stash. Each entry has one line on what it is and a link out. New links arrive in
          batches, and anything added in the last two weeks gets a NEW mark.
        </p>
        <h2>Thumbnails</h2>
        <p>
          Each thumbnail is the site&apos;s own social image or a screenshot of its homepage, saved when the link was added. They belong to the sites they show. A few sites block
          automated visits, so those get a pixel pattern until a picture is added by hand.
        </p>
      </div>
    </>
  );
}
