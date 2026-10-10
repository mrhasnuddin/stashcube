"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PixelCells } from "./PixelCells";
import { LogoTile } from "./pixel";

type Group = { slug: string; name: string; categories: { slug: string; name: string; hasNew: boolean }[] };

function NavLink({ href, active, children, badge }: { href: string; active: boolean; children: React.ReactNode; badge?: boolean }) {
  return (
    <Link className="nav" href={href} aria-current={active ? "page" : undefined}>
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
        <NavLink href="/" active={pathname === "/"}>
          Home
        </NavLink>
        <NavLink href="/new" active={pathname === "/new"}>
          Recently added
        </NavLink>
        {groups.map((g) => (
          <div className="grp" key={g.slug}>
            <span className="label">{g.name}</span>
            {g.categories.map((c) => (
              <NavLink key={c.slug} href={`/c/${c.slug}`} active={pathname.startsWith(`/c/${c.slug}`)} badge={c.hasNew}>
                {c.name}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
