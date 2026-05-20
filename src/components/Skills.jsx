import { useState, useEffect, useRef } from "react";
import SkillCard from "./SkillCard";

/* ─────────────────────────────────────────────────────────────
   THEME TOKENS  (copy-paste the same THEMES object from Hero.jsx
   or import from a shared theme.js)
───────────────────────────────────────────────────────────── */
const THEMES = {
  dark: {
    bg: "#111111",
    bgCard: "#191919",
    bgSection: "#141414",
    accent: "#FF6B1A",
    accentDim: "rgba(255,107,26,0.10)",
    text: "#F2F2F2",
    textMuted: "#666",
    textSub: "#999",
    border: "rgba(255,255,255,0.07)",
    borderAccent: "rgba(255,107,26,0.30)",
    pillBg: "rgba(255,107,26,0.12)",
    pillBorder: "rgba(255,107,26,0.28)",
    tabActiveBg: "#FF6B1A",
    tabBg: "rgba(255,255,255,0.04)",
    tabBorder: "rgba(255,255,255,0.08)",
  },
  light: {
    bg: "#F5F2EE",
    bgCard: "#FFFFFF",
    bgSection: "#EDEAE6",
    accent: "#E85D04",
    accentDim: "rgba(232,93,4,0.08)",
    text: "#1A1A1A",
    textMuted: "#999",
    textSub: "#666",
    border: "rgba(0,0,0,0.07)",
    borderAccent: "rgba(232,93,4,0.25)",
    pillBg: "rgba(232,93,4,0.08)",
    pillBorder: "rgba(232,93,4,0.22)",
    tabActiveBg: "#E85D04",
    tabBg: "rgba(0,0,0,0.04)",
    tabBorder: "rgba(0,0,0,0.08)",
  },
};

/* ─────────────────────────────────────────────────────────────
   SKILLS DATA — pulled from your GitHub README tech stack
   Add/remove/edit freely. `level` = proficiency 0–100
───────────────────────────────────────────────────────────── */
const ALL_SKILLS = [
  // Languages & Frameworks
  { name: "JavaScript", icon: "🟨", level: 95, category: "Language", group: "Languages & Frameworks",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "Python", icon: "🐍", level: 88, category: "Language", group: "Languages & Frameworks",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Node.js", icon: "🟢", level: 92, category: "Runtime", group: "Languages & Frameworks",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Express.js", icon: "🚂", level: 90, category: "Framework", group: "Languages & Frameworks",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  { name: "React", icon: "⚛", level: 85, category: "Frontend", group: "Languages & Frameworks",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "HTML5", icon: "🧱", level: 95, category: "Markup", group: "Languages & Frameworks",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3", icon: "🎨", level: 90, category: "Styling", group: "Languages & Frameworks",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },

  // Databases
  { name: "MongoDB", icon: "🍃", level: 88, category: "NoSQL", group: "Databases",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "MySQL", icon: "🐬", level: 85, category: "SQL", group: "Databases",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "PostgreSQL", icon: "🐘", level: 82, category: "SQL", group: "Databases",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "Supabase", icon: "⚡", level: 78, category: "BaaS", group: "Databases",
    iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/supabase.svg" },
  { name: "SQL Server", icon: "🗄", level: 75, category: "SQL", group: "Databases" },

  // DevOps & Tools
  { name: "Docker", icon: "🐳", level: 80, category: "DevOps", group: "DevOps & Tools",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Git", icon: "📦", level: 93, category: "VCS", group: "DevOps & Tools",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "GitHub", icon: "🐙", level: 93, category: "VCS", group: "DevOps & Tools",
    iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" },
  { name: "GitHub Actions", icon: "⚙️", level: 76, category: "CI/CD", group: "DevOps & Tools",
    iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/githubactions.svg" },
  { name: "VS Code", icon: "💻", level: 95, category: "Editor", group: "DevOps & Tools",
    iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visualstudiocode.svg" },
  { name: "Postman", icon: "📮", level: 90, category: "API", group: "DevOps & Tools",
    iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/postman.svg" },

  // Cloud & Deployment
  { name: "Vercel", icon: "▲", level: 88, category: "Cloud", group: "Cloud & Deployment",
    iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/vercel.svg" },
  { name: "Netlify", icon: "🌐", level: 85, category: "Cloud", group: "Cloud & Deployment",
    iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/netlify.svg" },
  { name: "Render", icon: "☁️", level: 82, category: "Cloud", group: "Cloud & Deployment",
    iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/render.svg" },

  // AI & Data
  { name: "Machine Learning", icon: "🧠", level: 78, category: "AI", group: "AI & Data" },
  { name: "RAG Systems", icon: "🔗", level: 82, category: "AI", group: "AI & Data" },
  { name: "Data Analysis", icon: "📊", level: 80, category: "Data", group: "AI & Data" },
  { name: "AI Applications", icon: "🤖", level: 85, category: "AI", group: "AI & Data" },
];

const GROUPS = ["All", ...Array.from(new Set(ALL_SKILLS.map((s) => s.group)))];

/* ─────────────────────────────────────────────────────────────
   GROUP META — icon + color accent per group
───────────────────────────────────────────────────────────── */
const GROUP_META = {
  "Languages & Frameworks": { icon: "🚀", color: "#FF6B1A" },
  "Databases":              { icon: "🗄️", color: "#3B82F6" },
  "DevOps & Tools":         { icon: "⚙️", color: "#10B981" },
  "Cloud & Deployment":     { icon: "☁️", color: "#8B5CF6" },
  "AI & Data":              { icon: "🤖", color: "#EC4899" },
};

/* ─────────────────────────────────────────────────────────────
   SKILLS SECTION
───────────────────────────────────────────────────────────── */
export default function Skills({ theme = "dark" }) {
  const [activeGroup, setActiveGroup] = useState("All");
  const [visible, setVisible] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const ref = useRef(null);
  const t = THEMES[theme];

  /* Intersection observer — animate in when section enters viewport */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const filtered =
    activeGroup === "All"
      ? ALL_SKILLS
      : ALL_SKILLS.filter((s) => s.group === activeGroup);

  /* Group skills by their group (for "All" view) */
  const groupedView = activeGroup === "All";
  const groupsInView = groupedView
    ? GROUPS.filter((g) => g !== "All")
    : [activeGroup];

  const fadeUp = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  });

  return (
    <section
      ref={ref}
      id="skills"
      style={{
        background: t.bg,
        padding: "72px 0 80px",
        fontFamily: "'Sora', sans-serif",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.4s",
        marginLeft: "var(--sidebar-width, 230px)",
      }}
    >
      {/* Font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');

        .skill-tab {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'Sora', sans-serif; font-size: 12.5px; font-weight: 600;
          padding: 7px 16px; border-radius: 8px; cursor: pointer;
          border: none; letter-spacing: 0.01em;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .skill-tab:hover { transform: translateY(-1px); }

        .group-heading {
          display: flex; align-items: center; gap: 10px;
          margin: 0 0 16px;
        }

        .skill-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 12px;
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .skill-card-anim {
          animation: fadeSlideUp 0.45s ease both;
        }

        @media (max-width: 640px) {
          .skill-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
          .tabs-row { flex-wrap: wrap !important; }
        }

        @media (max-width: 980px) {
          .skills-shell {
            padding: 0 clamp(20px, 4vw, 28px) !important;
          }
        }
      `}</style>

      {/* Background blobs */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${t.accent}10 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 200, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${t.accent}08 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div className="skills-shell" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)" }}>

        {/* ── Section header ── */}
        <div style={{ ...fadeUp(0.05), marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: t.pillBg, border: `1px solid ${t.pillBorder}`,
            borderRadius: 999, padding: "4px 12px",
            fontSize: 11, fontWeight: 700, color: t.accent,
            letterSpacing: "0.06em", textTransform: "uppercase",
            marginBottom: "1rem",
          }}>
            ⚡ Tech Stack
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
            fontWeight: 800, color: t.text,
            letterSpacing: "-0.03em", lineHeight: 1.08,
            margin: "0 0 0.6rem",
          }}>
            Skills &{" "}
            <span style={{ color: t.accent }}>Technologies</span>
          </h2>
          <p style={{ fontSize: 14, color: t.textSub, maxWidth: "52ch", lineHeight: 1.7 }}>
            Tools and technologies I use to design, build, and ship production-grade software and AI systems.
          </p>
        </div>

        {/* ── Filter tabs ── */}
        <div style={{ ...fadeUp(0.12), marginBottom: "2.5rem" }}>
          <div className="tabs-row" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {GROUPS.map((g) => {
              const isActive = activeGroup === g;
              const meta = GROUP_META[g];
              return (
                <button
                  key={g}
                  className="skill-tab"
                  onClick={() => setActiveGroup(g)}
                  style={{
                    background: isActive ? t.accent : t.tabBg,
                    color: isActive ? "#fff" : t.textSub,
                    border: `1px solid ${isActive ? t.accent : t.tabBorder}`,
                    boxShadow: isActive ? `0 4px 16px ${t.accent}44` : "none",
                  }}
                >
                  {meta?.icon && <span style={{ fontSize: 13 }}>{meta.icon}</span>}
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Skill groups ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {groupsInView.map((group, gi) => {
            const skills = groupedView
              ? ALL_SKILLS.filter((s) => s.group === group)
              : filtered;
            const meta = GROUP_META[group];
            const groupAccent = meta?.color || t.accent;

            return (
              <div
                key={group}
                style={{
                  ...fadeUp(0.08 + gi * 0.06),
                  background: t.bgSection,
                  border: `1px solid ${t.border}`,
                  borderRadius: 16,
                  padding: "24px 24px 20px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "border-color 0.25s",
                  borderColor: hoveredGroup === group ? `${groupAccent}44` : t.border,
                }}
                onMouseEnter={() => setHoveredGroup(group)}
                onMouseLeave={() => setHoveredGroup(null)}
              >
                {/* Top accent line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${groupAccent}, transparent)`,
                  opacity: hoveredGroup === group ? 1 : 0.4,
                  transition: "opacity 0.25s",
                }} />

                {/* Group heading */}
                <div className="group-heading">
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: `${groupAccent}18`,
                    border: `1px solid ${groupAccent}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 17, flexShrink: 0,
                  }}>
                    {meta?.icon || "📦"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: t.text, letterSpacing: "-0.01em" }}>
                      {group}
                    </div>
                    <div style={{ fontSize: 11, color: t.textMuted }}>
                      {skills.length} skill{skills.length !== 1 ? "s" : ""}
                    </div>
                  </div>

                  {/* Progress summary bar */}
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: groupAccent,
                      background: `${groupAccent}15`,
                      border: `1px solid ${groupAccent}30`,
                      borderRadius: 999, padding: "2px 9px",
                    }}>
                      avg {Math.round(skills.reduce((s, k) => s + k.level, 0) / skills.length)}%
                    </div>
                  </div>
                </div>

                {/* Skill cards grid */}
                <div className="skill-grid">
                  {skills.map((skill, si) => (
                    <div
                      key={skill.name}
                      className="skill-card-anim"
                      style={{ animationDelay: `${si * 55}ms` }}
                    >
                      <SkillCard
                        name={skill.name}
                        icon={skill.icon}
                        iconUrl={skill.iconUrl}
                        level={skill.level}
                        category={skill.category}
                        accent={groupAccent}
                        theme={theme}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
