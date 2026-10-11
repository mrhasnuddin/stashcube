import Image from "next/image";
import Link from "next/link";
import type { ItemView } from "@/lib/content";
import { PixelArrow, PixelPlaceholder, PopCube } from "./pixel";

const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");

export function ItemTile({ item, priority = false }: { item: ItemView; priority?: boolean }) {
  return (
    <div className="cell">
      <span className="pop">
        <PopCube />
      </span>
      <Link className="tile" href={`/item/${item.slug}`}>
        <i className="c" />
        <i className="c" />
        <i className="c" />
        <i className="c" />
        <div className="thumb">
          {item.thumbnail ? (
            <Image src={item.thumbnail} alt="" fill sizes="(max-width: 820px) 100vw, 280px" priority={priority} className="thumb-img" />
          ) : (
            <PixelPlaceholder seed={item.slug} />
          )}
          {item.comingSoon || item.pick || item.isNew ? (
            <span className="thumb-badges">
              {item.comingSoon ? <span className="badge soon">COMING SOON</span> : null}
              {item.pick ? <span className="badge pick">PICK</span> : null}
              {item.isNew ? <span className="badge">NEW</span> : null}
            </span>
          ) : null}
        </div>
        <div className="cap">
          <span>
            {item.title}
            <small>{hostOf(item.url)}</small>
          </span>
          <PixelArrow />
        </div>
      </Link>
    </div>
  );
}

export function CategoryTile({ slug, name, group, description, count }: { slug: string; name: string; group: string; description: string; count: number }) {
  return (
    <div className="cell">
      <span className="pop">
        <PopCube />
      </span>
      <Link className="tile cat" href={`/c/${slug}`}>
        <i className="c" />
        <i className="c" />
        <i className="c" />
        <i className="c" />
        <div className="cat-body">
          <span className="label">{group}</span>
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
        <div className="cap">
          <span className="mono-count">
            {count} {count === 1 ? "link" : "links"}
          </span>
          <PixelArrow />
        </div>
      </Link>
    </div>
  );
}
