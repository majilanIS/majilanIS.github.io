import { useState, useRef, useEffect } from "react";

/**
 * ProjectCard — reusable project card
 *
 * Props:
 *   title        {string}   project name
 *   tagline      {string}   one-line elevator pitch
 *   description  {string}   fuller description (shown on hover)
 *   problem      {string}   the real problem it solves
 *   tags         {string[]} tech tags e.g. ["Node.js","MongoDB"]
 *   accent       {string}   hex color for accents
 *   icon         {string}   emoji icon
 *   category     {string}   e.g. "AI / AgriTech"
 *   stats        {Array}    [{label, value}] — impact numbers
 *   githubUrl    {string}   GitHub link
 *   githubUrl2   {string}   second GitHub link (optional) — e.g. split back/front repos
 *   repoLabels   {string[]} labels for the repo buttons, defaults to ["Backend","Frontend"]
 *   liveUrl      {string}   Live demo link (optional)
 *   featured     {boolean}  renders slightly larger/highlighted
 *   theme        {string}   "dark" | "light"
 */
export default function ProjectCard({
  title = "Project",
  tagline = "",
  description = "",
  problem = "",
  tags = [],
  accent = "#FF6B1A",
  icon = "🛠",
  category = "",
  stats = [],
  githubUrl = "#",
  githubUrl2 = null,
  repoLabels = ["Backend", "Frontend"],
  liveUrl = null,
  demoVideo = null,
  image = null,
  featured = false,
  theme = "dark",
}) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const dark = theme === "dark";

  const bg       = dark ? (featured ? "#1A1A1A" : "#171717") : (featured ? "#FFFFFF" : "#FAFAFA");
  const border   = hovered ? `${accent}55` : dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const textPri  = dark ? "#F0F0F0" : "#1A1A1A";
  const textMut  = dark ? "#777" : "#888";
  const textSub  = dark ? "#999" : "#666";
  const tagBg    = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const tagBdr   = dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)";
  const btnBg    = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const btnBdr   = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  /* Two repos → label them so it's obvious which half of the stack each
     points at. One → "GitHub", unless repoLabels overrides it (a private
     project links the profile, which deserves a clearer label). */
  const repos = githubUrl2
    ? [
        { url: githubUrl, label: repoLabels[0] ?? "Backend" },
        { url: githubUrl2, label: repoLabels[1] ?? "Frontend" },
      ]
    : [{ url: githubUrl, label: repoLabels?.[0] ?? "GitHub" }];

  return (
    <div
      className="project-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 16,
        padding: "22px 22px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        boxShadow: hovered
          ? `0 12px 40px ${accent}1A, 0 2px 12px rgba(0,0,0,0.3)`
          : dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.28s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <style>{`
        .project-card {
          min-width: 0;
        }

        .project-card .project-card-image {
          will-change: transform;
        }

        @media (max-width: 640px) {
          .project-card {
            padding: 18px 16px 16px !important;
            border-radius: 14px !important;
          }

          .project-card .project-card-image {
            margin-left: -16px !important;
            margin-right: -16px !important;
            margin-top: -18px !important;
            height: 180px !important;
          }

          .project-card h3 {
            font-size: 16px !important;
          }

          .project-card .project-actions a,
          .project-card .project-actions button {
            width: 100%;
            justify-content: center;
          }

          .project-card .project-actions {
            flex-direction: column;
          }
        }
      `}</style>

      {/* Project image at top */}
      {image && (
        <div className="project-card-image" style={{
          marginBottom: 14,
          marginLeft: -22,
          marginRight: -22,
          marginTop: -22,
          borderRadius: '16px 16px 0 0',
          overflow: 'hidden',
          height: featured ? 280 : 200,
        }}>
          <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      {/* control preview playback when hovered */}
      {demoVideo && videoRef && (
        <HoverPlaybackController videoRef={videoRef} hovered={hovered} />
      )}
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: hovered ? `linear-gradient(90deg, ${accent}, ${accent}55, transparent)` : "transparent",
        transition: "background 0.3s",
        borderRadius: "16px 16px 0 0",
      }} />

      {/* Featured badge */}
      {featured && (
        <div style={{
          position: "absolute", top: 16, right: 16,
          background: `${accent}20`, border: `1px solid ${accent}40`,
          borderRadius: 999, padding: "3px 10px",
          fontSize: 10, fontWeight: 700, color: accent,
          letterSpacing: "0.06em", textTransform: "uppercase",
        }}>★ Featured</div>
      )}

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12, flexShrink: 0,
          background: hovered ? `${accent}22` : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
          border: `1px solid ${hovered ? accent + "44" : "transparent"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, transition: "background 0.25s, border-color 0.25s",
        }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap",
          }}>
            <h3 style={{
              fontFamily: "'Sora', sans-serif", fontWeight: 800,
              fontSize: featured ? 17 : 15, color: hovered ? accent : textPri,
              letterSpacing: "-0.02em", transition: "color 0.22s", margin: 0,
            }}>{title}</h3>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: accent, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {category}
          </div>
        </div>
      </div>

      {/* Tagline */}
      <p style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: 13, fontWeight: 700, color: textPri,
        marginBottom: 6, lineHeight: 1.25,
      }}>{tagline}</p>

      {/* Demo video (if provided) — muted preview plays on hover */}
      {demoVideo && (
        <div
          onClick={() => setModalOpen(true)}
          style={{
            marginBottom: 12,
            overflow: 'hidden',
            borderRadius: 8,
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <video
            ref={videoRef}
            src={demoVideo}
            muted
            loop
            playsInline
            preload="metadata"
            style={{ width: '100%', height: featured ? 260 : 160, objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', left: 12, bottom: 12, background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>▶ Demo</div>
        </div>
      )}

      {/* Problem (one-liner) */}
      {problem && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: accent, marginBottom: 4, textTransform: 'uppercase' }}>Problem</div>
          <div style={{ fontSize: 13, color: textSub, fontWeight: 700 }}>{problem}</div>
        </div>
      )}

      {/* Short description + details toggle */}
      <div style={{ fontSize: 12.5, color: textMut, lineHeight: 1.5, marginBottom: 12, flex: 1 }}>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: expanded ? 6 : 2, WebkitBoxOrient: 'vertical' }}>
          {description}
        </div>
        <button onClick={() => setExpanded((s) => !s)} style={{ marginTop: 8, background: 'transparent', border: 'none', color: accent, fontWeight: 700, cursor: 'pointer' }}>
          {expanded ? 'Show less' : 'Show details'}
        </button>
      </div>

      {/* Impact stats */}
      {stats.length > 0 && (
        <div style={{
          display: "grid", gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)`,
          gap: 8, marginBottom: 14,
        }}>
          {stats.map(({ label, value }) => (
            <div key={label} style={{
              background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              border: `1px solid ${hovered ? accent + "22" : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              borderRadius: 8, padding: "7px 10px", textAlign: "center",
              transition: "border-color 0.25s",
            }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: hovered ? accent : textPri, lineHeight: 1, transition: "color 0.22s" }}>{value}</div>
              <div style={{ fontSize: 9.5, fontWeight: 600, color: textMut, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
        {tags.map((tag) => (
          <span key={tag} style={{
            fontSize: 10.5, fontWeight: 600, color: textSub,
            background: tagBg, border: `1px solid ${tagBdr}`,
            borderRadius: 5, padding: "2px 7px", letterSpacing: "0.02em",
          }}>{tag}</span>
        ))}
      </div>

      {/* Action buttons */}
      <div className="project-actions" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {repos.map(({ url, label }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: btnBg, border: `1px solid ${btnBdr}`,
            borderRadius: 7, padding: "6px 12px", textDecoration: "none",
            fontSize: 11.5, fontWeight: 700, color: textSub, fontFamily: "'Sora',sans-serif",
            transition: "border-color 0.2s, color 0.2s, background 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent + "66"; e.currentTarget.style.color = accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = btnBdr; e.currentTarget.style.color = textSub; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.75 5.48.75 11.76c0 4.96 3.22 9.17 7.7 10.65.56.1.76-.24.76-.54 0-.27-.01-1-.01-1.95-3.13.68-3.8-1.51-3.8-1.51-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .17 1.55.93 1.55.93.99 1.7 2.6 1.21 3.24.93.1-.72.39-1.21.71-1.49-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.47.11-3.06 0 0 .95-.3 3.12 1.15a10.8 10.8 0 0 1 2.84-.38c.96 0 1.92.13 2.84.38 2.16-1.45 3.11-1.15 3.11-1.15.61 1.59.23 2.77.12 3.06.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.27-5.15 5.55.4.35.76 1.05.76 2.12 0 1.53-.01 2.77-.01 3.15 0 .3.2.65.77.54 4.48-1.48 7.69-5.69 7.69-10.65C23.25 5.48 18.27.5 12 .5z"/></svg>
            {label}
          </a>
        ))}
        {liveUrl ? (
          <a href={liveUrl} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: accent, border: `1px solid ${accent}`,
            borderRadius: 7, padding: "6px 12px", textDecoration: "none",
            fontSize: 11.5, fontWeight: 700, color: "#fff", fontFamily: "'Sora',sans-serif",
            boxShadow: `0 2px 12px ${accent}44`,
            transition: "opacity 0.2s, transform 0.15s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.03)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Live Demo
          </a>
        ) : (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "transparent", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
            borderRadius: 7, padding: "6px 12px",
            fontSize: 11.5, fontWeight: 600, color: textMut, fontFamily: "'Sora',sans-serif",
          }}>
            🚧 Coming Soon
          </span>
        )}
      </div>
      {modalOpen && demoVideo && <DemoModal src={demoVideo} onClose={() => setModalOpen(false)} />}
    </div>
  );
}

function HoverPlaybackController({ videoRef, hovered }) {
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (hovered) {
      const p = el.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      try {
        el.pause();
        el.currentTime = 0;
      } catch (e) {}
    }
  }, [hovered, videoRef]);
  return null;
}

function DemoModal({ src, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ width: '90%', maxWidth: 1200, borderRadius: 10, overflow: 'hidden', background: '#000' }} onClick={(e) => e.stopPropagation()}>
        <video src={src} controls autoPlay style={{ width: '100%', height: 'auto', display: 'block' }} />
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>
      </div>
    </div>
  );
}
