import { useState } from "react";

/**
 * ChatMarkdown — renders the assistant's markdown into React elements.
 *
 * Deliberately a small hand-rolled subset (headings, lists, bold, italic,
 * inline code, code fences, rules, links) rather than a markdown dependency:
 * the input is LLM output, so it is built as React elements and never as
 * innerHTML — there is no path here for injected markup to execute.
 *
 * Links render with a copy button, because the most common thing a visitor
 * wants from this chat is to grab a GitHub or LinkedIn URL.
 */

type Props = { content: string; theme?: "dark" | "light"; accent?: string };

type Colors = {
  text: string;
  muted: string;
  codeBg: string;
  codeBorder: string;
  rule: string;
  linkBg: string;
  accent: string;
};

/* ── Link sanitiser ───────────────────────────────────────────────
   The model repeatedly reconstructs the GitHub username from Chekole's
   name — "Chekole-Ngusalem", "chekole-m" — instead of copying the real
   handle, which sends visitors to a 404 or, worse, a stranger's account.
   Prompt rules alone did not hold, so this is enforced in code.

   Any github.com URL whose owner is not one of the real accounts is
   rewritten to the canonical profile. Owners that ARE real pass through
   untouched, so repo links keep working. */
const GITHUB_PROFILE = "https://github.com/majilanIS";
const GITHUB_OWNERS = ["majilanis", "ereceiptset-del"];

const GITHUB_URL_RE =
  /(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9._-]+)((?:\/[A-Za-z0-9._-]+)*)\/?/g;

/* Models often drop the protocol ("github.com/…"), which would render as
   plain text instead of a copyable chip. Both rules re-add it. */
const LINKEDIN_URL_RE =
  /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(in\/[A-Za-z0-9._-]+)\/?/g;

export function sanitizeLinks(src: string): string {
  return src
    .replace(GITHUB_URL_RE, (_full, owner: string, path: string) => {
      if (GITHUB_OWNERS.includes(owner.toLowerCase())) {
        return `https://github.com/${owner}${path || ""}`;
      }
      return GITHUB_PROFILE;
    })
    .replace(LINKEDIN_URL_RE, (_full, slug: string) => `https://www.linkedin.com/${slug}`);
}

export default function ChatMarkdown({ content, theme = "dark", accent = "#60a5fa" }: Props) {
  const dark = theme === "dark";
  const c: Colors = {
    text: dark ? "#e0e7ff" : "#1a1a1a",
    muted: dark ? "#a5b4fc" : "#64748b",
    codeBg: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)",
    codeBorder: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
    rule: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)",
    linkBg: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    accent,
  };

  return <>{renderBlocks(sanitizeLinks(content), c)}</>;
}

/* ── Block level ──────────────────────────────────────────────── */
function renderBlocks(src: string, c: Colors) {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* Code fence */
    if (/^\s*```/.test(line)) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) body.push(lines[i++]);
      i++; // closing fence
      out.push(<CodeBlock key={key++} code={body.join("\n")} c={c} />);
      continue;
    }

    /* Horizontal rule */
    if (/^\s*([-*_])\s*\1\s*\1[\s*_-]*$/.test(line)) {
      out.push(
        <hr key={key++} style={{ border: 0, borderTop: `1px solid ${c.rule}`, margin: "10px 0" }} />
      );
      i++;
      continue;
    }

    /* Heading */
    const h = /^\s*(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const size = [15, 14, 13.5, 13][level - 1];
      out.push(
        <div
          key={key++}
          style={{
            fontSize: size,
            fontWeight: 800,
            color: c.text,
            letterSpacing: "-0.01em",
            margin: out.length ? "12px 0 5px" : "0 0 5px",
          }}
        >
          {renderInline(stripEmphasis(h[2]), c)}
        </div>
      );
      i++;
      continue;
    }

    /* Unordered list — collect the whole run, including nested items */
    if (/^\s*[-*•]\s+/.test(line)) {
      const items: { depth: number; text: string }[] = [];
      while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) {
        const m = /^(\s*)[-*•]\s+(.*)$/.exec(lines[i])!;
        items.push({ depth: Math.min(2, Math.floor(m[1].length / 2)), text: m[2] });
        i++;
      }
      out.push(<Bullets key={key++} items={items} c={c} />);
      continue;
    }

    /* Ordered list */
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(/^\s*\d+[.)]\s+(.*)$/.exec(lines[i])![1]);
        i++;
      }
      out.push(
        <ol key={key++} style={{ margin: "4px 0 8px", paddingLeft: 20, display: "grid", gap: 4 }}>
          {items.map((it, n) => (
            <li key={n} style={{ color: c.text, lineHeight: 1.5 }}>
              {renderInline(it, c)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    /* Blank line */
    if (!line.trim()) {
      i++;
      continue;
    }

    /* Paragraph — join until a blank line or the start of another block */
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^\s*(#{1,4}\s|[-*•]\s|\d+[.)]\s|```)/.test(lines[i])
    ) {
      para.push(lines[i++]);
    }
    out.push(
      <p key={key++} style={{ margin: "0 0 8px", color: c.text, lineHeight: 1.55 }}>
        {renderInline(para.join(" "), c)}
      </p>
    );
  }

  return out;
}

function Bullets({ items, c }: { items: { depth: number; text: string }[]; c: Colors }) {
  return (
    <div style={{ margin: "4px 0 8px", display: "grid", gap: 5 }}>
      {items.map((it, n) => (
        <div
          key={n}
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            paddingLeft: it.depth * 14,
          }}
        >
          <span
            style={{
              color: c.accent,
              flexShrink: 0,
              lineHeight: 1.55,
              fontSize: it.depth ? 9 : 11,
              marginTop: it.depth ? 3 : 1,
            }}
          >
            {it.depth ? "◦" : "▸"}
          </span>
          <span style={{ color: c.text, lineHeight: 1.55, minWidth: 0 }}>
            {renderInline(it.text, c)}
          </span>
        </div>
      ))}
    </div>
  );
}

function CodeBlock({ code, c }: { code: string; c: Colors }) {
  return (
    <div style={{ position: "relative", margin: "6px 0 10px" }}>
      <pre
        style={{
          background: c.codeBg,
          border: `1px solid ${c.codeBorder}`,
          borderRadius: 8,
          padding: "10px 12px",
          overflowX: "auto",
          fontSize: 11.5,
          lineHeight: 1.5,
          color: c.text,
          margin: 0,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        }}
      >
        {code}
      </pre>
      <CopyButton value={code} c={c} style={{ position: "absolute", top: 6, right: 6 }} />
    </div>
  );
}

/* ── Inline level ─────────────────────────────────────────────── */
const INLINE_RE =
  /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*\n]+)\*|(https?:\/\/[^\s<>()[\]]+)/g;

function renderInline(src: string, c: Colors): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;

  INLINE_RE.lastIndex = 0;
  while ((m = INLINE_RE.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));

    const [full, linkText, linkUrl, code, bold, bold2, italic, bareUrl] = m;

    if (linkUrl) out.push(<LinkChip key={key++} label={linkText} url={linkUrl} c={c} />);
    else if (bareUrl) out.push(<LinkChip key={key++} label={prettyUrl(bareUrl)} url={bareUrl} c={c} />);
    else if (code)
      out.push(
        <code
          key={key++}
          style={{
            background: c.codeBg,
            border: `1px solid ${c.codeBorder}`,
            borderRadius: 5,
            padding: "1px 5px",
            fontSize: "0.9em",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          }}
        >
          {code}
        </code>
      );
    else if (bold || bold2)
      out.push(
        <strong key={key++} style={{ fontWeight: 800, color: c.text }}>
          {bold || bold2}
        </strong>
      );
    else if (italic) out.push(<em key={key++}>{italic}</em>);
    else out.push(full);

    last = m.index + full.length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

/* A link the visitor can both open and copy — the main thing people want
   out of this chat is the URL itself. */
function LinkChip({ label, url, c }: { label: string; url: string; c: Colors }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        maxWidth: "100%",
        background: c.linkBg,
        border: `1px solid ${c.codeBorder}`,
        borderRadius: 6,
        padding: "1px 4px 1px 7px",
        verticalAlign: "baseline",
      }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: c.accent,
          fontWeight: 700,
          textDecoration: "none",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: 230,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        {label}
      </a>
      <CopyButton value={url} c={c} />
    </span>
  );
}

function CopyButton({
  value,
  c,
  style,
}: {
  value: string;
  c: Colors;
  style?: React.CSSProperties;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* Clipboard API needs a secure context; fall back to a temp selection. */
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing else to try — leave `copied` false */
        document.body.removeChild(ta);
        return;
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : `Copy ${value}`}
      title={copied ? "Copied!" : "Copy"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        height: 20,
        flexShrink: 0,
        borderRadius: 5,
        border: "none",
        background: "transparent",
        color: copied ? c.accent : c.muted,
        cursor: "pointer",
        padding: 0,
        transition: "color 0.15s, background 0.15s",
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = c.codeBg)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {copied ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

/* ── helpers ──────────────────────────────────────────────────── */
function prettyUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/* Headings sometimes arrive already wrapped in ** — don't double up. */
function stripEmphasis(s: string) {
  return s.replace(/^\*\*(.*)\*\*$/, "$1").trim();
}
