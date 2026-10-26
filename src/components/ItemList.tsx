import Image from "next/image";
import Link from "next/link";
import type { ItemView } from "@/lib/content";
import { InstallBlock } from "./InstallBlock";
import { NewBadge } from "./NewBadge";
import { PixelCells } from "./PixelCells";
import { PixelArrow } from "./pixel";

const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");

/** List view: one row per link, each opening straight to the official link and, for skills, the install command. */
export function ItemList({ items, showCategory = true }: { items: ItemView[]; showCategory?: boolean }) {
  return (
    <ul className="list">
      {items.map((i) => {
        const host = hostOf(i.url);
        return (
          <li key={i.slug}>
            <details className="lrow">
              <summary>
                <span className="row-thumb">{i.thumbnail ? <Image src={i.thumbnail} alt="" width={44} height={44} /> : null}</span>
                <span className="row-title">
                  <b>{i.title}</b>
                  <small>{host}</small>
                </span>
                <span className="row-desc">{i.description}</span>
                <span className="row-meta">
                  {i.comingSoon ? <span className="badge soon">COMING SOON</span> : null}
                  {i.pick ? <span className="badge pick">PICK</span> : null}
                  <NewBadge since={i.newSince} />
                  {showCategory || i.home ? <span className="badge out">{i.categoryName}</span> : null}
                </span>
                <span className="row-plus log-plus" aria-hidden="true" />
              </summary>
              <div className="row-body">
                {i.install?.length ? <InstallBlock lines={i.install} /> : null}
                <div className="row-actions">
                  <a className="btn p" href={i.url} target="_blank" rel="noopener noreferrer">
                    <span className="t">
                      {host === "github.com" ? "Open on GitHub" : "Visit site"} <PixelArrow />
                    </span>
                    <PixelCells kind="btn" />
                  </a>
                  <Link className="btn s" href={`/item/${i.slug}`}>
                    <span className="t">Details</span>
                  </Link>
                </div>
              </div>
            </details>
          </li>
        );
      })}
    </ul>
  );
}
