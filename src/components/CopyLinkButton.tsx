"use client";

import { useEffect, useRef, useState } from "react";
import { PixelCells } from "./PixelCells";
import { PixelCheck } from "./pixel";

type State = "idle" | "busy" | "done";

// Clipboard API first; a hidden textarea and execCommand as the fallback (older browsers, or a page without clipboard permission).
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

/*
 * Copy-link CTA. The process state lives inside the button: idle, busy and done labels share one grid cell, so the
 * button never changes size. Busy: the letters hop in a stepped wave. Done: a pixel check pops in beside the label.
 */
export function CopyLinkButton({ url, label = "Copy link" }: { url: string; label?: string }) {
  const [state, setState] = useState<State>("idle");
  const [announce, setAnnounce] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = async () => {
    if (state !== "idle") return;
    setState("busy");
    setAnnounce("Copying");
    const started = performance.now();
    const ok = await copyText(url);
    // keep the busy state visible long enough to read, even though copying is instant
    const wait = Math.max(0, 700 - (performance.now() - started));
    timers.current.push(
      setTimeout(() => {
        setState(ok ? "done" : "idle");
        setAnnounce(ok ? "Copied" : "Could not copy");
        timers.current.push(setTimeout(() => { setState("idle"); setAnnounce(""); }, 1400));
      }, wait),
    );
  };

  return (
    <button type="button" className="btn p" data-state={state} aria-busy={state === "busy" || undefined} onClick={run}>
      <span className="t cta-stack">
        <span className="cta-idle">{label}</span>
        <span className="cta-busy" aria-hidden="true">
          {[..."Copying"].map((c, i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties}>
              {c}
            </span>
          ))}
        </span>
        <span className="cta-done" aria-hidden="true">
          <PixelCheck />
          Copied
        </span>
      </span>
      <span className="sr" role="status">
        {announce}
      </span>
      <PixelCells kind="btn" />
    </button>
  );
}
