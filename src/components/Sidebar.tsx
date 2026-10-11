"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DeanStudioLink } from "./DeanStudioLink";
import { PixelCells } from "./PixelCells";
import { LogoTile } from "./pixel";

type Group = { slug: string; name: string; categories: { slug: string; name: string; hasNew: boolean }[] };

function NavLink({ href, active, children, badge, root }: { href: string; active: boolean; children: React.ReactNode; badge?: boolean; root?: boolean }) {
  return (
    <Link className={root ? "nav root" : "nav"} href={href} aria-current={active ? "page" : undefined}>
      <span>{children}</span>
      {badge ? <span className="badge">NEW</span> : null}
      <PixelCells kind="nav" />
    </Link>
  );
}

export function Sidebar({ groups }: { groups: Group[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <aside data-open={open}>
      <div className="aside-top">
        <Link className="brand" href="/" aria-label="Stashcube home">
          <LogoTile size={32} />
          <span className="wm">
            stash<b>cube</b>
          </span>
        </Link>
        {/* Narrow screens only: the category list folds away behind this button */}
        <button type="button" className="btn s menu-toggle" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
          <span className="t">{open ? "Close" : "Menu"}</span>
        </button>
      </div>
      <nav id="site-nav" aria-label="Categories" onClick={() => setOpen(false)}>
        <NavLink root href="/" active={pathname === "/"}>
          Home
        </NavLink>
        <NavLink root href="/new" active={pathname === "/new"}>
          Recently added
        </NavLink>
        <NavLink root href="/picks" active={pathname === "/picks"}>
          My go-to stack
        </NavLink>
        {groups.map((g) => (
          <div className="grp" role="group" aria-labelledby={`grp-${g.slug}`} key={g.slug}>
            <div className="grp-head">
              <span className="label" id={`grp-${g.slug}`}>
                {g.name}
              </span>
            </div>
            <div className="grp-list">
              {g.categories.map((c) => (
                <NavLink key={c.slug} href={`/c/${c.slug}`} active={pathname.startsWith(`/c/${c.slug}`)} badge={c.hasNew}>
                  {c.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
        <div className="grp-foot">
          <NavLink root href="/changelog" active={pathname === "/changelog"}>
            Changelog
          </NavLink>
        </div>
        <p className="credit label">
          Curated by <DeanStudioLink />
        </p>
      </nav>
    </aside>
  );
}
