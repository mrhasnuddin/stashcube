import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { totalCount } from "@/lib/content";

export const metadata: Metadata = { title: "About", description: "What Stashcube is and how the links are kept." };

export default function AboutPage() {
  return (
    <>
      <PageHeader trail={[{ label: "About" }]} />
      <div className="page-head">
        <span className="label">About</span>
        <h1>A bookmark folder, made public</h1>
      </div>
      <div className="prose">
        <p>
          Stashcube holds the links I save while building: UI libraries, 3D tools, icon sets, fonts, and sites that make me stop and look.
          There are {totalCount()} so far, sorted by what they are for rather than where I found them.
        </p>
        <h2>How it works</h2>
        <p>
          Every entry is one link, one line on what it is, and a few tags. Pick a category in the sidebar, narrow it with tags, or press / to search
          the whole stash.
        </p>
        <p>New links arrive in batches. Anything added in the last two weeks gets a NEW mark.</p>
        <h2>Thumbnails</h2>
        <p>
          Each thumbnail is the site&apos;s own social image or a screenshot of its homepage, saved at the time the link was added. They belong to the
          sites they show. A few sites block automated visits, so those get a pixel pattern until I add a picture by hand.
        </p>
      </div>
    </>
  );
}
