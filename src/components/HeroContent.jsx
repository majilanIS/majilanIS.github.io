import { useState, useEffect } from "react";
import portrait from "../assets/image.png";
// import portrail_1 from "../assets/image_1.png";

/* ─── theme tokens ─────────────────────────────────────────── */
const THEMES = {
  dark: {
    bg: "#111111",
    bgCard: "#191919",
    bgNav: "#151515",
    accent: "#FF6B1A",
    accentMid: "#FF8C42",
    accentDim: "rgba(255,107,26,0.12)",
    text: "#F2F2F2",
    textMuted: "#888",
    textSub: "#AAAAAA",
    border: "rgba(255,255,255,0.08)",
    borderAccent: "rgba(255,107,26,0.35)",
    navIcon: "#999",
    pillBg: "rgba(255,107,26,0.12)",
    pillBorder: "rgba(255,107,26,0.3)",
    frameBorder: "rgba(255,107,26,0.25)",
    frameGlow: "0 0 40px rgba(255,107,26,0.15), 0 0 80px rgba(255,107,26,0.06)",
    cornerColor: "#FF6B1A",
    toggleBg: "#222",
    shadow: "0 24px 48px rgba(0,0,0,0.5)",
  },
  light: {
    bg: "#F5F2EE",
    bgCard: "#FFFFFF",
    bgNav: "#FFFFFF",
    accent: "#E85D04",
    accentMid: "#FF6B1A",
    accentDim: "rgba(232,93,4,0.10)",
    text: "#1A1A1A",
    textMuted: "#777",
    textSub: "#555",
    border: "rgba(0,0,0,0.08)",
    borderAccent: "rgba(232,93,4,0.3)",
    navIcon: "#777",
    pillBg: "rgba(232,93,4,0.08)",
    pillBorder: "rgba(232,93,4,0.25)",
    frameBorder: "rgba(232,93,4,0.2)",
    frameGlow: "0 0 40px rgba(232,93,4,0.10), 0 24px 48px rgba(0,0,0,0.08)",
    cornerColor: "#E85D04",
    toggleBg: "#E8E4DF",
    shadow: "0 24px 48px rgba(0,0,0,0.12)",
  },
};

/* ─── animated typewriter roles ─────────────────────────────── */
const ROLES = ["Full-Stack Developer", "AI Engineer", "RAG Pipeline Builder"];

function TypewriterRole({ accent }) {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const target = ROLES[roleIdx];
    let timeout;
    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % ROLES.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIdx]);

  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <span style={{ color: accent, fontWeight: 700 }}>
      {displayed}
      <span style={{ opacity: cursor ? 1 : 0, marginLeft: 1 }}>|</span>
    </span>
  );
}

/* ─── HeroContent ────────────────────────────────────────────── */
export default function HeroContent({ theme }) {
  const [mounted, setMounted] = useState(false);
  const t = THEMES[theme];

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const fadeIn = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  });

  return (
    <section
      className="hero-section"
      style={{ position: "relative", overflow: "hidden", width: "100%" }}
    >
      <style>{`
          position: "relative",
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@1,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          gap: "2rem",
        ::selection { background: ${t.accent}33; }

          maxWidth: 1180,
          marginLeft: "var(--sidebar-width, 230px)",
          marginRight: "auto",
          padding: "4rem 2rem 3.5rem 2rem",
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 ${t.accent}55; }
          70% { box-shadow: 0 0 0 10px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
          
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: ${t.accent}; color: #fff;
          font-family: 'Sora', sans-serif; font-size: 13.5px; font-weight: 700;
          padding: 11px 22px; border-radius: 8px; border: none; cursor: pointer;
          text-decoration: none; letter-spacing: 0.01em;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px ${t.accent}44;
        }
        .btn-primary:hover { background: ${t.accentMid}; transform: translateY(-2px); box-shadow: 0 8px 28px ${t.accent}55; }
        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: ${t.text};
          font-family: 'Sora', sans-serif; font-size: 13.5px; font-weight: 600;
          padding: 10px 20px; border-radius: 8px;
          border: 1.5px solid ${t.border}; cursor: pointer;
          text-decoration: none; letter-spacing: 0.01em;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
        }
        .btn-outline:hover { border-color: ${t.accent}; background: ${t.accentDim}; transform: translateY(-2px); }
        .social-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 8px;
          background: transparent; border: 1.5px solid ${t.border};
          color: ${t.textMuted}; cursor: pointer; text-decoration: none;
          transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.15s;
        }
        .social-btn:hover { border-color: ${t.accent}; color: ${t.accent}; background: ${t.accentDim}; transform: translateY(-2px); }
        .stat-card {
          background: ${t.bgCard}; border: 1px solid ${t.border};
          border-radius: 10px; padding: 10px 14px; text-align: center;
          transition: background 0.4s, border-color 0.4s;
        }
        .stat-card:hover { border-color: ${t.borderAccent}; }

        @media (max-width: 980px) {
          .hero-shell {
            margin-left: 250px;
            max-width: 100% !important;
            padding-inline: clamp(16px, 4vw, 24px) !important;
            width: 100% !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
          }

          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.2rem !important;
            padding-top: 2.5rem !important;
            max-width: 100% !important;
          }

          .hero-portrait {
            justify-self: center !important;
            margin-right: 0 !important;
            width: auto !important;
            max-width: clamp(220px, 46vw, 320px) !important;
            margin-left: auto !important;
            margin-right: auto !important;
            flex: 0 1 auto !important;
          }

          /* reduce inner portrait top spacing on smaller screens */
          .hero-portrait > div {
            margin-top: 24px !important;
            width: 100% !important;
          }

          .hero-stat-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 640px) {
          .hero-shell {
            padding-inline: 16px !important;
          }

          .hero-grid {
            gap: 1.6rem !important;
            padding-top: 6rem !important;
            padding-inline: 0 !important;
          }

          .hero-portrait {
            margin-top: 0.5rem;
            max-width: clamp(180px, 48vw, 260px) !important;
            width: auto !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }

          .hero-portrait > div {
            margin-top: 16px !important;
          }

          .hero-grid h1 {
            font-size: clamp(1.85rem, 10vw, 2.75rem) !important;
            line-height: 1.02 !important;
          }

          .hero-stat-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: 100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${t.accent}18 0%, transparent 68%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: 80,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${t.accent}0F 0%, transparent 68%)`,
          pointerEvents: "none",
        }}
      />

      {/* Hero grid */}
      <div
          id="home"
          className="hero-shell hero-grid"
        style={{
          display: "flex",
          justifyContent: "space-around",
          gap: "clamp(2rem, 4vw, 5rem)",
          alignItems: "center",
          flexWrap: "nowrap",
          width: "calc(100% - var(--sidebar-width, 230px))",
          maxWidth: 1320,
          marginLeft: "var(--sidebar-width, 230px)",
          marginRight: "auto",
          paddingInline: "clamp(24px, 4vw, 72px)",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* ── LEFT: Text content ── */}
        <div>
          {/* Name + Typewriter */}
          <div style={fadeIn(0.12)}>
            <p style={{ fontSize: 15, color: t.textMuted, fontWeight: 400, marginBottom: "0.3rem" }}>
              Hello, my name is{" "}
              <span style={{ color: t.text, fontWeight: 600 }}>Chekole Ngusalem</span>
            </p>
            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "clamp(1.3rem, 3vw, 2rem)",
                fontWeight: 800,
                lineHeight: 1,
                color: t.text,
                letterSpacing: "-0.03em",
                marginBottom: "0.5rem",
              }}
            >
              I'm a <TypewriterRole accent={t.accent} />
            </h1>
          </div>

          {/* Divider */}
          <div
            style={{
              ...fadeIn(0.18),
              width: 48,
              height: 3,
              background: t.accent,
              borderRadius: 3,
              margin: "1rem 0 1.1rem",
            }}
          />

          {/* Lead paragraph */}
          <p
            style={{
              ...fadeIn(0.22),
              fontSize: 14.5,
              lineHeight: 1.72,
              color: t.textSub,
              maxWidth: "54ch",
              marginBottom: "1.5rem",
            }}
          >
            I build{" "}
            <span style={{ color: t.text, fontWeight: 600 }}>scalable backend systems</span>,
            RESTful APIs, and{" "}
            <span style={{ color: t.text, fontWeight: 600 }}>AI-powered applications</span>.
            Backend-focused, but fluent across the full stack — from Node.js services to React
            frontends and RAG pipelines.
          </p>

          {/* CTA buttons */}
          <div
            style={{
              ...fadeIn(0.28),
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: "1.4rem",
            }}
          >
            <a href="#projects" className="btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              View my projects
            </a>
            <a href="https://drive.google.com/file/d/1dEx_QWowNZWXkNxhOlzBocfnrUWyIbWH/view?usp=sharing" className="btn-outline" style={{ color: t.text, borderColor: t.border }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download CV
            </a>
          </div>

          {/* Social links */}
          <div style={{ ...fadeIn(0.34), display: "flex", gap: 8 }}>
            {[
              {
                label: "GitHub",
                href: "https://github.com/majilanIS/",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .5C5.73.5.75 5.48.75 11.76c0 4.96 3.22 9.17 7.7 10.65.56.1.76-.24.76-.54 0-.27-.01-1-.01-1.95-3.13.68-3.8-1.51-3.8-1.51-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .17 1.55.93 1.55.93.99 1.7 2.6 1.21 3.24.93.1-.72.39-1.21.71-1.49-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.47.11-3.06 0 0 .95-.3 3.12 1.15a10.8 10.8 0 0 1 2.84-.38c.96 0 1.92.13 2.84.38 2.16-1.45 3.11-1.15 3.11-1.15.61 1.59.23 2.77.12 3.06.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.27-5.15 5.55.4.35.76 1.05.76 2.12 0 1.53-.01 2.77-.01 3.15 0 .3.2.65.77.54 4.48-1.48 7.69-5.69 7.69-10.65C23.25 5.48 18.27.5 12 .5z" />
                  </svg>
                ),
              },
              {
                label: "LinkedIn",
                href: "https://linkedin.com/in/chekole-majilan-8b4651336/",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 24h4V7h-4v17zM8.5 7v17h4v-9.3c0-2.3.8-3.9 2.9-3.9 2 0 2.1 1.8 2.1 4v9.2h4V13c0-5.6-3-8.2-7-8.2-3.2 0-4.6 1.8-5.1 3.1V7h-1z" />
                  </svg>
                ),
              },
              {
                label: "X",
                href: "https://x.com/",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3.01a10.9 10.9 0 0 1-3.14.86A4.93 4.93 0 0 0 22.4.36a9.86 9.86 0 0 1-3.13 1.2 4.92 4.92 0 0 0-8.39 4.48A13.96 13.96 0 0 1 1.64.89 4.92 4.92 0 0 0 3.2 6.7a4.9 4.9 0 0 1-2.23-.62v.06a4.92 4.92 0 0 0 3.95 4.82 4.9 4.9 0 0 1-2.22.08 4.92 4.92 0 0 0 4.6 3.42A9.86 9.86 0 0 1 0 19.54a13.94 13.94 0 0 0 7.55 2.21c9.05 0 14-7.5 14-14v-.64A10.02 10.02 0 0 0 23 3.01z" />
                  </svg>
                ),
              },
            ].map(({ label, icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label={label}
                style={{ color: t.textMuted, borderColor: t.border }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Portrait ── */}
        <div
          className="hero-portrait"
          style={{
            ...fadeIn(0.1),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            flex: "0 1 clamp(260px, 30vw, 360px)",
            maxWidth: "360px",
            marginRight: "clamp(12px, 3vw, 40px)",
            width: "100%",
          }}
        >
          {/* Corner bracket frame */}
          <div style={{ position: "relative", width: "100%", animation: "float 5s ease-in-out infinite" }}>
            {/* Top-left corner */}
            <div style={{ position: "absolute", top: -10, left: -10, zIndex: 2 }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M2 26 L2 2 L26 2" stroke={t.cornerColor} strokeWidth="2.5" strokeLinecap="square" fill="none" />
              </svg>
            </div>
            {/* Bottom-right corner */}
            <div style={{ position: "absolute", bottom: -10, right: -10, zIndex: 2 }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M26 2 L26 26 L2 26" stroke={t.cornerColor} strokeWidth="2.5" strokeLinecap="square" fill="none" />
              </svg>
            </div>
            {/* Top-right corner (subtle) */}
            <div style={{ position: "absolute", top: -10, right: -10, zIndex: 2, opacity: 0.35 }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M2 2 L26 2 L26 26" stroke={t.cornerColor} strokeWidth="2.5" strokeLinecap="square" fill="none" />
              </svg>
            </div>
            {/* Bottom-left corner (subtle) */}
            <div style={{ position: "absolute", bottom: -10, left: -10, zIndex: 2, opacity: 0.35 }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M26 26 L2 26 L2 2" stroke={t.cornerColor} strokeWidth="2.5" strokeLinecap="square" fill="none" />
              </svg>
            </div>

            {/* Portrait image */}
            <div
              style={{
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                border: `1px solid ${t.frameBorder}`,
                boxShadow: t.frameGlow,
                background:
                  theme === "dark"
                    ? "radial-gradient(circle at 30% 20%, rgba(130,130,130,0.28), rgba(49,49,49,0.95) 58%, rgba(26,26,26,1) 100%)"
                    : "radial-gradient(circle at 30% 20%, rgba(236,231,220,0.96), rgba(220,212,198,0.96) 60%, rgba(193,183,168,1) 100%)",
                aspectRatio: "3/4",
                width: "100%",
                marginTop: 45,
              }}
            >
              <img
                src={portrait}
                alt="Chekole Ngusalem"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    theme === "dark"
                      ? "linear-gradient(165deg, rgba(32,32,32,0.28), rgba(140,140,140,0.22))"
                      : "linear-gradient(165deg, rgba(215,205,190,0.34), rgba(165,152,134,0.26))",
                  mixBlendMode: "multiply",
                }}
              />
            </div>

            {/* "Open to work" floating chip */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                background: theme === "dark" ? "rgba(17,17,17,0.88)" : "rgba(255,255,255,0.88)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${t.borderAccent}`,
                borderRadius: 999,
                padding: "5px 14px",
                fontSize: 11.5,
                fontWeight: 700,
                color: t.accent,
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                zIndex: 3,
                boxShadow: `0 4px 16px ${t.accent}22`,
              }}
            >
              ● &nbsp;Open to work
            </div>
          </div>

          {/* Stats row */}
          <div className="hero-stat-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, width: "100%", maxWidth: 320 }}>
            {[
              { num: "3+", label: "Years Experience" },
              { num: "50+", label: "Projects" },
              { num: "3+", label: "Clients" },
            ].map(({ num, label }) => (
              <div
                key={label}
                className="stat-card"
                style={{ background: t.bgCard, borderColor: t.border }}
              >
                <div style={{ fontSize: 18, fontWeight: 800, color: t.accent, lineHeight: 1, marginBottom: 3 }}>
                  {num}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: t.textMuted,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
