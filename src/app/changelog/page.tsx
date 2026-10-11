import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { pageMeta } from "@/lib/site";
import { getChangelog, type ChangeType, type ChangelogEntry } from "@/lib/content";

export const metadata: Metadata = pageMeta({ title: "Changelog", description: "What changed in Stashcube, latest build first.", path: "/changelog" });

const LABELS: Record<ChangeType, string> = { added: "Added", changed: "Changed", fixed: "Fixed" };
const ORDER: ChangeType[] = ["added", "changed", "fixed"];
const date = (iso: string) => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

function Body({ e }: { e: ChangelogEntry }) {
  const minor = e.changes.filter((c) => c.minor);
  return (
    <>
      {e.summary ? <p className="log-summary">{e.summary}</p> : null}
      {ORDER.map((type) => {
        const list = e.changes.filter((c) => c.type === type && !c.minor);
        return list.length ? (
          <div className="log-group" key={type}>
            <span className={`label log-type log-${type}`}>{LABELS[type]}</span>
            <ul>
              {list.map((c, i) => (
                <li key={i}>{c.text}</li>
              ))}
            </ul>
          </div>
        ) : null;
      })}
      {minor.length ? (
        <div className="log-group log-small">
          <span className="label log-type">Smaller changes</span>
          <ul>
            {minor.map((c, i) => (
              <li key={i}>{c.text}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

const Meta = ({ e }: { e: ChangelogEntry }) => (
  <div className="log-meta label">
    <span className="log-version">v{e.version}</span>
    <time dateTime={e.date}>{date(e.date)}</time>
  </div>
);

export default function ChangelogPage() {
  const [latest, ...older] = getChangelog();
  return (
    <>
      <PageHeader trail={[{ label: "Changelog" }]} />
      <div className="page-head">
        <span className="label">Changelog</span>
        <h1>What changed</h1>
        <p>The latest build first. Big updates get their own version, and the small fixes and tweaks around them are folded in.</p>
      </div>
      {latest ? (
        <section className="log-box log-latest" aria-label="Latest build">
          <span className="label log-flag">Latest build</span>
          <article className="log-entry">
            <Meta e={latest} />
            <h2>{latest.title}</h2>
            <Body e={latest} />
          </article>
        </section>
      ) : null}
      {older.length ? (
        <section className="log-box log-older" aria-label="Earlier builds">
          <span className="label log-flag">Earlier builds</span>
          {older.map((e) => (
            <details className="log-fold" key={e.version}>
              <summary>
                <div>
                  <Meta e={e} />
                  <h2>{e.title}</h2>
                </div>
                <span className="log-toggle" aria-hidden="true">
                  <span className="log-plus" />
                </span>
              </summary>
              <div className="log-body">
                <Body e={e} />
              </div>
            </details>
          ))}
        </section>
      ) : null}
    </>
  );
}
