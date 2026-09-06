import { useState } from "react";

/* ─── theme tokens ───────────────────────────────────────────── */
const THEMES = {
  dark: {
    bg: "#111111",
    bgCard: "#191919",
    bgCardHover: "#1f1f1f",
    bgNav: "#151515",
    accent: "#FF6B1A",
    accentMid: "#FF8C42",
    accentDim: "rgba(255,107,26,0.10)",
    accentDimHover: "rgba(255,107,26,0.18)",
    text: "#F2F2F2",
    textMuted: "#888",
    textSub: "#AAAAAA",
    border: "rgba(255,255,255,0.07)",
    borderAccent: "rgba(255,107,26,0.35)",
    tagBg: "rgba(255,107,26,0.10)",
    tagText: "#FF8C42",
    featuredBorder: "rgba(255,107,26,0.5)",
  },
  light: {
    bg: "#F5F2EE",
    bgCard: "#FFFFFF",
    bgCardHover: "#FAFAFA",
    bgNav: "#FFFFFF",
    accent: "#E85D04",
    accentMid: "#FF6B1A",
    accentDim: "rgba(232,93,4,0.08)",
    accentDimHover: "rgba(232,93,4,0.15)",
    text: "#1A1A1A",
    textMuted: "#888",
    textSub: "#555",
    border: "rgba(0,0,0,0.07)",
    borderAccent: "rgba(232,93,4,0.35)",
    tagBg: "rgba(232,93,4,0.08)",
    tagText: "#C44A00",
    featuredBorder: "rgba(232,93,4,0.5)",
  },
};

/* ─── service data ───────────────────────────────────────────── */
const SERVICES = [
  {
    id: "fullstack",
    featured: true,
    badge: "Most requested",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="12" y1="2" x2="12" y2="22" />
      </svg>
    ),
    title: "Full-Stack Development",
    tagline: "Production-ready web apps",
    description: "Build scalable web apps: API, frontend, and deployment.",
    tags: ["Node.js", "React", "Postgres", "Docker"],
    deliverables: ["API + frontend", "Deployment"],
  },
  {
    id: "mobile",
    featured: false,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Mobile App Development",
    tagline: "iOS & Android (React Native)",
    description: "Cross-platform apps with offline support and store deployment.",
    tags: ["React Native", "Expo", "iOS", "Android"],
    deliverables: ["App UI", "Store release"],
  },
  {
    id: "ai-chatbot",
    featured: false,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: "AI Chatbot",
    tagline: "Custom LLM assistants",
    description: "Chatbots grounded in your data for support and knowledge tasks.",
    tags: ["RAG", "Embeddings", "Chat UI", "Streaming"],
    deliverables: ["Prompt design", "Chat UI"],
  },
  {
    id: "rag",
    featured: false,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    title: "RAG Pipeline",
    tagline: "Vector search for accurate answers",
    description: "Connect docs to LLMs for grounded, citable responses.",
    tags: ["pgvector", "Embeddings", "Search", "Ingestion"],
    deliverables: ["Ingestion", "Vector store"],
  },
  {
    id: "ai-integration",
    featured: false,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: "AI Feature Integration",
    tagline: "Add AI features to products",
    description: "Integrate smart search, generation, and recommendations.",
    tags: ["API", "NLP", "Recommendations", "Summaries"],
    deliverables: ["Integration", "Prompt tune"],
  },
  {
    id: "automation",
    featured: false,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 6v6l4 2" />
        <path d="M18 2v4h4" />
        <path d="M22 2l-4 4" />
      </svg>
    ),
    title: "AI Automation & Agents",
    tagline: "Autonomous task automation",
    description: "Automate workflows and scheduled agents for repeatable tasks.",
    tags: ["Agents", "Webhooks", "Scheduling", "Python"],
    deliverables: ["Workflow", "Monitoring"],
  },
];

/* ─── ServiceCard ────────────────────────────────────────────── */
function ServiceCard({ service, t }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? t.bgCardHover : t.bgCard,
        border: service.featured
          ? `1.5px solid ${hovered ? t.featuredBorder : t.borderAccent}`
          : `1px solid ${hovered ? t.borderAccent : t.border}`,
        borderRadius: 14,
        padding: "1.6rem",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        transition: "background 0.25s, border-color 0.25s, transform 0.2s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        position: "relative",
        cursor: "default",
      }}
    >
      {/* Featured badge */}
      {service.featured && (
        <div style={{
          position: "absolute", top: -1, right: 18,
          background: t.accent, color: "#fff",
          fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em",
          textTransform: "uppercase", padding: "3px 10px",
          borderRadius: "0 0 8px 8px",
        }}>
          {service.badge}
        </div>
      )}

      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: hovered ? t.accentDimHover : t.accentDim,
        border: `1px solid ${t.borderAccent}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: t.accent, marginBottom: "1.1rem",
        transition: "background 0.25s",
      }}>
        {service.icon}
      </div>

      {/* Title + tagline */}
      <div style={{ marginBottom: "0.75rem" }}>
        <h3 style={{
          fontSize: 16, fontWeight: 800, color: t.text,
          letterSpacing: "-0.02em", marginBottom: 3,
        }}>
          {service.title}
        </h3>
        <p style={{ fontSize: 12.5, color: t.accent, fontWeight: 600, letterSpacing: "0.01em" }}>
          {service.tagline}
        </p>
      </div>

      {/* Description */}
      <p style={{
        fontSize: 13.5, color: t.textSub, lineHeight: 1.7,
        marginBottom: "1.1rem", flexGrow: 1,
      }}>
        {service.description}
      </p>

      {/* Deliverables */}
      <div style={{ marginBottom: "1.1rem" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>
          What you get
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {service.deliverables.map((d) => (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: t.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: t.textSub }}>{d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.4rem" }}>
        {service.tags.map((tag) => (
          <span key={tag} style={{
            background: t.tagBg,
            color: t.tagText,
            fontSize: 11, fontWeight: 600,
            padding: "3px 9px", borderRadius: 6,
            letterSpacing: "0.02em",
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <a
        href="#hire-me"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          background: hovered ? t.accent : "transparent",
          color: hovered ? "#fff" : t.accent,
          border: `1.5px solid ${hovered ? t.accent : t.borderAccent}`,
          borderRadius: 8, padding: "10px 16px",
          fontSize: 13, fontWeight: 700, textDecoration: "none",
          letterSpacing: "0.01em",
          transition: "background 0.2s, color 0.2s, border-color 0.2s",
        }}
      >
        Get a quote
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

/* ─── Services ───────────────────────────────────────────────── */
export default function Services({ theme = "dark" }) {
  const t = THEMES[theme];

  /* process pill */
  const PROCESS = [
    { step: "01", label: "Discovery call", desc: "We align on goals, scope, and timeline." },
    { step: "02", label: "Proposal",        desc: "I send a detailed quote and project plan." },
    { step: "03", label: "Build & iterate", desc: "Weekly check-ins, demos, and feedback loops." },
    { step: "04", label: "Handover",        desc: "Docs, deployment, and post-launch support." },
  ];

  return (
    <div
      id="services"
      style={{
        fontFamily: "'Sora', 'DM Sans', sans-serif",
        background: "transparent",
        minHeight: "100vh",
        padding: "64px clamp(20px, 4vw, 56px) 80px",
        transition: "background 0.4s",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 860px) {
          #services { padding: 40px 20px 60px !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .process-row { grid-template-columns: 1fr !important; }
          .process-connector { display: none !important; }
        }
        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
      `}</style>

      {/* ── Section heading ── */}
      <div style={{ marginBottom: "3.2rem", maxWidth: 560 }}>
        <p style={{ fontSize: 13, color: t.accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          What I do
        </p>
        <h2 style={{
          fontSize: "clamp(1.9rem, 3vw, 2.7rem)", fontWeight: 800,
          color: t.text, letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 12,
        }}>
          Services I offer
        </h2>
        <div style={{ width: 40, height: 3, background: t.accent, borderRadius: 3, marginBottom: 16 }} />
        <p style={{ fontSize: 14.5, color: t.textSub, lineHeight: 1.72 }}>
          Backend-focused but full-stack capable — I build everything from scalable APIs and data pipelines to AI-powered products and mobile apps.
        </p>
      </div>

      {/* ── Service cards grid ── */}
      <div
        className="services-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "1.2rem",
          marginBottom: "4.5rem",
        }}
      >
        {SERVICES.map((s) => (
          <ServiceCard key={s.id} service={s} t={t} />
        ))}
      </div>

      {/* ── How it works ── */}
      <div style={{
        background: t.bgCard,
        border: `1px solid ${t.border}`,
        borderRadius: 16,
        padding: "2.4rem 2.8rem",
      }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: t.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
          Process
        </p>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: t.text, letterSpacing: "-0.02em", marginBottom: "2rem" }}>
          How we'll work together
        </h3>

        <div
          className="process-row"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.4rem",
          }}
        >
          {PROCESS.map(({ step, label, desc }, i) => (
            <div key={step} style={{ position: "relative" }}>
              {/* Connector line */}
              {i < PROCESS.length - 1 && (
                <div className="process-connector" style={{
                  position: "absolute", top: 18, left: "calc(100% - 8px)",
                  width: "calc(1.4rem + 16px)", height: 1,
                  background: t.borderAccent, zIndex: 0,
                }} />
              )}
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: t.accentDim, border: `1px solid ${t.borderAccent}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: t.accent,
                marginBottom: 12, position: "relative", zIndex: 1,
              }}>
                {step}
              </div>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: t.text, marginBottom: 5 }}>{label}</p>
              <p style={{ fontSize: 12.5, color: t.textSub, lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: "2.4rem", paddingTop: "1.8rem",
          borderTop: `1px solid ${t.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 14,
        }}>
          <p style={{ fontSize: 14, color: t.textSub }}>
            Ready to start? <span style={{ color: t.text, fontWeight: 600 }}>Let's talk about your project.</span>
          </p>
          <a
            href="#hire-me"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: t.accent, color: "#fff",
              fontSize: 13.5, fontWeight: 700,
              padding: "11px 22px", borderRadius: 8,
              textDecoration: "none", letterSpacing: "0.01em",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = t.accentMid}
            onMouseOut={(e) => e.currentTarget.style.background = t.accent}
          >
            Book a discovery call
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
