import React, { useState } from "react";

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

export default function Sidebar({ theme, setTheme }) {
  const t = THEMES[theme] || THEMES.dark;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", icon: "⌂" },
    { label: "About", icon: "◉" },
    { label: "Projects", icon: "⬡" },
    { label: "Skills", icon: "◈" },
    { label: "Services", icon: "◇" },
    { label: "Certificates", icon: "▣" },
    { label: "Hire Me", icon: "★" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@1,700&display=swap');

        * {
          box-sizing: border-box;
        }

        .sidebar {
          overflow-y: auto;
          scrollbar-width: none;
          width: var(--sidebar-width, 230px);
        }

        .sidebar::-webkit-scrollbar {
          display: none;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          color: ${t.navIcon};
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 12px 0;
          border-left: 2px solid transparent;
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .nav-link:hover {
          color: ${t.accent};
          border-left-color: ${t.accent};
          padding-left: 10px;
        }

        .nav-link.active {
          color: ${t.accent};
          border-left-color: ${t.accent};
          padding-left: 10px;
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: ${t.toggleBg};
          border: 1.5px solid ${t.border};
          color: ${t.text};
          cursor: pointer;
          font-size: 18px;
          transition: all 0.3s ease;
        }

        .toggle-btn:hover {
          transform: scale(1.08) rotate(10deg);
          border-color: ${t.accent};
        }

        .toggle-btn.active {
          background: ${t.accentDim};
          border-color: ${t.accent};
          color: ${t.accent};
        }

        @media (max-width: 900px) {
          .sidebar {
            width: calc(100% - 16px) !important;
            top: 8px;
            left: 8px;
            right: 8px;
            bottom: auto;
            height: ${mobileMenuOpen ? "auto" : "68px"};
            max-height: ${mobileMenuOpen ? "calc(100vh - 16px)" : "68px"};
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            gap: ${mobileMenuOpen ? "10px" : "0"};
            padding: ${mobileMenuOpen ? "10px 12px 12px" : "8px 12px"};
            background: ${t.bg};
            border-right: none;
            border-bottom: 1px solid ${t.border};
            border-radius: 16px;
            box-shadow: ${t.shadow};
            overflow: hidden;
            padding-bottom: 2rem;
            z-index: 1000;
          }

          .sidebar-logo {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: ${mobileMenuOpen ? "0 0 8px" : "0"};
            border-bottom: ${mobileMenuOpen ? `1px solid ${t.border}` : "none"};
          }

          .sidebar-nav {
            display: ${mobileMenuOpen ? "flex" : "none"} !important;
            flex: 0 0 auto;
            flex-direction: column !important;
            align-items: stretch;
            gap: 8px !important;
            padding: 4px 0 2px !important;
            overflow: visible;
          }

          .sidebar-nav::-webkit-scrollbar {
            display: none;
          }

          .nav-link {
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            gap: 10px;
            border-left: none;
            padding: 12px 10px;
            font-size: 13px;
            min-width: 0;
            white-space: normal;
            width: 100%;
            border-radius: 12px;
            background: ${t.bgCard};
            border: 1px solid ${t.border};
          }

          .nav-link:hover,
          .nav-link.active {
            border-left: none;
            padding-left: 10px;
          }

          .nav-label {
            display: block;
          }

          .theme-section {
            display: none !important;
          }

          .appearance-text {
            display: none;
          }

          .theme-section > div:last-child {
            justify-content: flex-end;
          }

          .toggle-btn {
            width: 38px;
            height: 38px;
            border-radius: 11px;
          }

          .mobile-actions {
            display: flex !important;
            align-items: center;
            gap: 8px;
            margin-left: auto;
          }

          .mobile-menu-btn {
            display: flex !important;
          }

          .desktop-title {
            display: block;
          }
        }

        .mobile-actions,
        .mobile-menu-btn,
        .desktop-title {
          display: none;
        }

        .mobile-menu-btn {
          border: 1.5px solid ${t.border};
          background: ${t.toggleBg};
          color: ${t.text};
        }

        .mobile-menu-btn:hover {
          transform: scale(1.06);
          border-color: ${t.accent};
        }
      `}</style>

      <aside
        className="sidebar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 230,
          background: t.bgNav,
          borderRight: `1px solid ${t.border}`,
          display: "flex",
          flexDirection: "column",
          zIndex: 100,
          padding: "28px 0",
          transition: "all 0.4s ease",
          fontFamily: "'Sora', sans-serif",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* ─── Logo ───────────────────── */}
        <div
          className="sidebar-logo"
          style={{
            padding: "0 24px 28px",
            borderBottom: `1px solid ${t.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${t.accent}, ${t.accentMid})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 18,
                color: "#fff",
                letterSpacing: "-0.03em",
                boxShadow: t.frameGlow,
              }}
            >
              C
            </div>

            <div className="desktop-title">
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 16,
                  color: t.text,
                  letterSpacing: "-0.02em",
                }}
              >
                Chekole
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: t.textMuted,
                  marginTop: 2,
                }}
              >
                Full Stack Developer
              </div>
            </div>
          </div>

          <div className="mobile-actions">
            <button
              type="button"
              className="mobile-menu-btn toggle-btn"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              title="Menu"
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
              }}
            >
              ☰
            </button>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                className={`toggle-btn ${theme === "dark" ? "active" : ""}`}
                onClick={() => setTheme("dark")}
                title="Dark Mode"
              >
                🌙
              </button>

              <button
                className={`toggle-btn ${theme === "light" ? "active" : ""}`}
                onClick={() => setTheme("light")}
                title="Light Mode"
              >
                ☀️
              </button>
            </div>
          </div>
        </div>

        {/* ─── Navigation ───────────────────── */}
        <nav
          className="sidebar-nav"
          style={{
            flex: 1,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {navItems.map(({ label, icon }, index) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`nav-link ${index === 0 ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span
                style={{
                  fontSize: 17,
                  width: 20,
                  textAlign: "center",
                }}
              >
                {icon}
              </span>

              <span className="nav-label">{label}</span>
            </a>
          ))}
        </nav>

        {/* ─── Theme Toggle ───────────────────── */}
        <div
          className="theme-section"
          style={{
            padding: "20px 24px",
            borderTop: `1px solid ${t.border}`,
          }}
        >
          <div
            className="appearance-text"
            style={{
              fontSize: 11,
              color: t.textMuted,
              fontWeight: 700,
              letterSpacing: "0.08em",
              marginBottom: 12,
              textTransform: "uppercase",
            }}
          >
            Appearance
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              className={`toggle-btn ${
                theme === "dark" ? "active" : ""
              }`}
              onClick={() => setTheme("dark")}
              title="Dark Mode"
            >
              🌙
            </button>

            <button
              className={`toggle-btn ${
                theme === "light" ? "active" : ""
              }`}
              onClick={() => setTheme("light")}
              title="Light Mode"
            >
              ☀️
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}