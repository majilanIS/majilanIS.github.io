import { useState, useEffect, useRef } from "react";
import ProjectCard from "./ProjectCard";
import agrivitaImg from "../assets/agrivita_image.png";
import agrispark from "../assets/agrispark_image.png";
import adwaImg from "../assets/image-adwa.jpg";
import portfolioImg from "../assets/portifolio-image.png";

const THEMES = {
  dark: {
    bg: "#111111",
    bgSection: "#141414",
    accent: "#FF6B1A",
    accentDim: "rgba(255,107,26,0.10)",
    text: "#F2F2F2",
    textMuted: "#666",
    textSub: "#999",
    border: "rgba(255,255,255,0.07)",
    pillBg: "rgba(255,107,26,0.12)",
    pillBorder: "rgba(255,107,26,0.28)",
    tabBg: "rgba(255,255,255,0.04)",
    tabBorder: "rgba(255,255,255,0.08)",
  },
  light: {
    bg: "#F5F2EE",
    bgSection: "#EDEAE6",
    accent: "#E85D04",
    accentDim: "rgba(232,93,4,0.08)",
    text: "#1A1A1A",
    textMuted: "#999",
    textSub: "#666",
    border: "rgba(0,0,0,0.07)",
    pillBg: "rgba(232,93,4,0.08)",
    pillBorder: "rgba(232,93,4,0.22)",
    tabBg: "rgba(0,0,0,0.04)",
    tabBorder: "rgba(0,0,0,0.08)",
  },
};

/* ─────────────────────────────────────────────────────────────
   PROJECTS DATA
───────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: "agrivita",
    title: "AgriVita",
    tagline: "AI-powered crop disease & pest detection with profit optimization",
    category: "AI / AgriTech",
    icon: "🌿",
    accent: "#22C55E",
    featured: true,
    filter: "ai",
    image: agrivitaImg,
    problem: "Farmers lose 20–40% yield to undetected crop disease and pests.",
    description: "Mobile AI: scan a plant, get diagnosis, treatment suggestions and profit-optimised options. Bilingual chat support.",
    tags: ["Python", "TensorFlow", "React Native", "Node.js", "MongoDB", "RAG", "OpenCV"],
    githubUrl: "https://github.com/majilanIS/AgriVita",
    liveUrl:"https://agrivita-frontend-us8i.vercel.app/",
  },
  {
    id: "agrispark",
    title: "AgriSpark",
    tagline: "Smart agricultural marketplace connecting farmers to buyers directly",
    category: "AgriTech / Marketplace",
    icon: "⚡",
    accent: "#F59E0B",
    featured: false,
    filter: "fullstack",
    image: agrispark,
    problem: "Smallholders receive low prices via middlemen; buyers lack verified live inventory.",
    description: "Peer-to-peer marketplace: verified farmers list produce and accept orders with live inventory and payments.",
    tags: ["Node.js", "Express", "React", "MongoDB", "REST API", "JWT Auth"],
    githubUrl: "https://github.com/majilanIS/AgriSpark-app",
    liveUrl: null,
  },
  {
    id: "adwa-ai",
    title: "Adwa AI Assistant",
    tagline: "Voice + text AI chatbot with real-time knowledge retrieval",
    category: "AI / Chatbot",
    icon: "🤖",
    accent: "#8B5CF6",
    featured: false,
    filter: "ai",
    image: adwaImg,
    problem: "Assistants lack voice input and local/contextual knowledge in Amharic.",
    description: "Voice+text assistant grounded with RAG; bilingual answers and streaming UI for fast, accurate responses.",
    tags: ["Node.js", "React", "RAG", "OpenAI API", "Web Speech API", "Vercel", "Supabase"],
    githubUrl: "https://github.com/majilanIS/Adwa-AI-Assistant",
    liveUrl: "https://adwa-ai-assistant-in-text-or-voice.vercel.app",
  },
  {
    id: "fraud-detection",
    title: "Fraud Detection System",
    tagline: "ML-powered real-time transaction fraud detection engine",
    category: "Machine Learning / FinTech",
    icon: "🛡️",
    accent: "#EF4444",
    featured: false,
    filter: "ai",
    problem: "Rule-based fraud detectors cause many false positives and blocked transactions.",
    description: "Ensemble ML pipeline for real-time scoring with high precision; exposes a low-latency REST API for production use.",
    tags: ["Python", "Scikit-learn", "XGBoost", "SMOTE", "Flask", "PostgreSQL", "Docker"],
    githubUrl: "https://github.com/majilanIS/fraud-detection",
    liveUrl: null,
  },
  {
    id: "portfolio",
    title: "chekole.dev",
    tagline: "This portfolio — built from scratch with React, dark/light theming, and zero templates",
    category: "Frontend / Portfolio",
    icon: "💼",
    accent: "#FF6B1A",
    featured: false,
    filter: "fullstack",
    image: portfolioImg,
    problem: "Templates feel generic and don't showcase individual design or technical signal.",
    description: "Hand-built React portfolio with animated hero, theme toggle and curated project demos (this site).",
    tags: ["React", "CSS-in-JS", "Vite", "Vercel", "Sora", "Responsive"],
    githubUrl: "https://github.com/majilanIS/majilanIS.github.io",
    liveUrl: "https://majilan-is-github-io-tcba.vercel.app/",
  },
];

const FILTERS = [
  { id: "all", label: "All Projects" },
  { id: "ai", label: "🤖 AI / ML" },
  { id: "fullstack", label: "⚡ Full-Stack" },
];

export default function Projects({ theme = "dark" }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const t = THEMES[theme];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const filtered =
    activeFilter === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.filter === activeFilter);

  const fadeUp = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  });

  return (
    <section
      ref={ref}
      id="projects"
      style={{
        background: t.bg,
        padding: "72px 0 80px",
        fontFamily: "'Sora', sans-serif",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.4s",
        width: "100%",
      }}
    >
      <style>{`
        *,*::before,*::after{box-sizing:border-box}

        .proj-tab {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600;
          padding: 6px 15px; border-radius: 8px; cursor: pointer;
          border: none; letter-spacing: 0.01em;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .proj-tab:hover { transform: translateY(-1px); }

        .proj-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .proj-anim { animation: fadeSlideUp 0.45s ease both; }

        @media (max-width: 700px) {
          .proj-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 980px) {
          .projects-shell {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 clamp(20px, 4vw, 28px) !important;
          }

          .proj-grid > div {
            grid-column: span 1 !important;
          }
        }

        .proj-cta-row {
          display: flex; align-items: center; gap: 12px;
          flex-wrap: wrap;
        }
      `}</style>

      {/* Background blobs */}
      <div style={{ position: "absolute", top: -80, left: -60, width: 340, height: 340, borderRadius: "50%", background: `radial-gradient(circle, ${t.accent}0E 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 40, right: 0, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${t.accent}09 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div className="projects-shell" style={{ width: "100%", margin: 0, padding: "0 clamp(20px, 4vw, 40px)" }}>

        {/* ── Section header ── */}
        <div style={{ ...fadeUp(0.04), marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: t.pillBg, border: `1px solid ${t.pillBorder}`,
            borderRadius: 999, padding: "4px 12px",
            fontSize: 11, fontWeight: 700, color: t.accent,
            letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1rem",
          }}>
            🔗 Real Projects
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800,
            color: t.text, letterSpacing: "-0.03em", lineHeight: 1.08,
            margin: "0 0 0.5rem",
          }}>
            Problems I've{" "}
            <span style={{ color: t.accent }}>Solved</span>
          </h2>
          <p style={{ fontSize: 14, color: t.textSub, maxWidth: "55ch", lineHeight: 1.6 }}>
            Selected, impact-driven projects with concise problem statements and clear outcomes. Click a demo to explore each project in depth.
          </p>
        </div>

        {/* ── Filter tabs ── */}
        <div style={{ ...fadeUp(0.1), marginBottom: "2rem", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              className="proj-tab"
              onClick={() => setActiveFilter(id)}
              style={{
                background: activeFilter === id ? t.accent : t.tabBg,
                color: activeFilter === id ? "#fff" : t.textSub,
                border: `1px solid ${activeFilter === id ? t.accent : t.tabBorder}`,
                boxShadow: activeFilter === id ? `0 4px 16px ${t.accent}44` : "none",
              }}
            >
              {label}
              <span style={{
                fontSize: 10, fontWeight: 700, marginLeft: 2,
                background: activeFilter === id ? "rgba(255,255,255,0.22)" : t.tabBorder,
                borderRadius: 999, padding: "1px 6px",
                color: activeFilter === id ? "#fff" : t.textMuted,
              }}>
                {id === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.filter === id).length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Projects grid ── */}
        <div style={{ ...fadeUp(0.14) }}>
          <div className="proj-grid">
            {filtered.map((proj, i) => (
              <div
                key={proj.id}
                className="proj-anim"
                style={{
                  animationDelay: `${i * 70}ms`,
                  gridColumn: proj.featured && filtered.length > 1 ? "span 2" : "span 1",
                }}
              >
                <ProjectCard {...proj} theme={theme} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div style={{ ...fadeUp(0.3), marginTop: "2.5rem", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <a
            href="https://github.com/majilanIS/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: t.accent, color: "#fff",
              fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700,
              padding: "10px 20px", borderRadius: 9, textDecoration: "none",
              boxShadow: `0 4px 20px ${t.accent}44`,
              transition: "opacity 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.75 5.48.75 11.76c0 4.96 3.22 9.17 7.7 10.65.56.1.76-.24.76-.54 0-.27-.01-1-.01-1.95-3.13.68-3.8-1.51-3.8-1.51-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .17 1.55.93 1.55.93.99 1.7 2.6 1.21 3.24.93.1-.72.39-1.21.71-1.49-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.47.11-3.06 0 0 .95-.3 3.12 1.15a10.8 10.8 0 0 1 2.84-.38c.96 0 1.92.13 2.84.38 2.16-1.45 3.11-1.15 3.11-1.15.61 1.59.23 2.77.12 3.06.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.27-5.15 5.55.4.35.76 1.05.76 2.12 0 1.53-.01 2.77-.01 3.15 0 .3.2.65.77.54 4.48-1.48 7.69-5.69 7.69-10.65C23.25 5.48 18.27.5 12 .5z"/></svg>
            View all on GitHub
          </a>
          <span style={{ fontSize: 12.5, color: t.textMuted }}>
            {PROJECTS.length} projects · {PROJECTS.filter((p) => p.liveUrl).length} live
          </span>
        </div>
      </div>
    </section>
  );
}
