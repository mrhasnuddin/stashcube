import Link from "next/link";
import { Fragment } from "react";
import { SearchBox } from "./SearchBox";

export type Crumb = { label: string; href?: string };

export function PageHeader({ trail, hideSearch = false }: { trail: Crumb[]; hideSearch?: boolean }) {
  return (
    <div className="crumb label">
      {trail.map((c, i) => {
        const last = i === trail.length - 1;
        return (
          <Fragment key={c.label + i}>
            {i > 0 ? <span aria-hidden="true">&gt;</span> : null}
            {c.href && !last ? (
              <Link href={c.href}>{c.label}</Link>
            ) : (
              <span className={last ? "cur" : undefined} aria-current={last ? "page" : undefined}>
                {c.label}
              </span>
            )}
          </Fragment>
        );
      })}
      <span className="grow" />
      {hideSearch ? null : <SearchBox />}
    </div>
  );
}
