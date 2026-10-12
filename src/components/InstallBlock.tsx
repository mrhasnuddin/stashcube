import { CopyButton } from "./CopyButton";

/** Install commands with a copy button (all lines are copied together). */
export function InstallBlock({ lines }: { lines: string[] }) {
  return (
    <div className="install">
      <pre>
        <code>{lines.join("\n")}</code>
      </pre>
      <CopyButton text={lines.join("\n")} label="Copy command" />
    </div>
  );
}
