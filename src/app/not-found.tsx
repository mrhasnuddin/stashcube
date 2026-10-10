import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function NotFound() {
  return (
    <>
      <PageHeader trail={[{ label: "Not found" }]} />
      <div className="page-head">
        <span className="label">404</span>
        <h1>That link isn&apos;t in the stash</h1>
        <p>
          The page may have moved, or the address has a typo. Try the <Link href="/search">search</Link> or head back <Link href="/">home</Link>.
        </p>
      </div>
    </>
  );
}
