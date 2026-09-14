// Renders the light markdown Shopping Muse uses in its replies: paragraphs,
// **bold**, *italic*, "- " / "1. " bullet lines and [text](url) links. No
// HTML is ever injected.

import Link from "next/link";
import type { ReactNode } from "react";

function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    const tok = m[0];
    const key = `${keyPrefix}-${i++}`;
    if (tok.startsWith("**")) out.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("[")) {
      const [, label, href] = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/) ?? [];
      if (href && (href.startsWith("/") || href.startsWith("https://"))) {
        out.push(
          <Link key={key} href={href} className="font-semibold underline underline-offset-2">
            {label}
          </Link>,
        );
      } else out.push(label ?? tok);
    } else out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    last = idx + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function MuseText({ text }: { text: string }) {
  const blocks = text.replace(/\r/g, "").split(/\n{2,}/).filter((b) => b.trim());
  return (
    <div className="space-y-2">
      {blocks.map((block, b) => {
        const lines = block.split("\n").filter((l) => l.trim());
        const isList = lines.length > 0 && lines.every((l) => /^\s*([-*•]|\d+[.)])\s+/.test(l));
        if (isList) {
          const ordered = /^\s*\d+[.)]/.test(lines[0]);
          const items = lines.map((l, i) => (
            <li key={i} className="pl-1">
              {inline(l.replace(/^\s*([-*•]|\d+[.)])\s+/, ""), `${b}-${i}`)}
            </li>
          ));
          return ordered ? (
            <ol key={b} className="list-decimal pl-5 space-y-1">
              {items}
            </ol>
          ) : (
            <ul key={b} className="list-disc pl-5 space-y-1">
              {items}
            </ul>
          );
        }
        return (
          <p key={b}>
            {lines.map((l, i) => (
              <span key={i}>
                {inline(l, `${b}-${i}`)}
                {i < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
