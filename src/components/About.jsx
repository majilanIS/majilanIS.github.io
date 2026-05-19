import React from "react";
import AboutMe from "./AboutMe";
import "./AboutPage.css";

/* small theme tokens (kept local for About page) */
const THEMES = {
  dark: {
    bg: "#0b0f19",
    bgNav: "#05060a",
    bgCard: "#0f1114",
    accent: "#60a5fa",
    text: "#e6eef8",
    textSub: "#cbd5e1",
    border: "rgba(255,255,255,0.04)",
    timeline: "rgba(96,165,250,0.25)",
  },
  light: {
    bg: "#F7F5F2",
    bgNav: "#F2EFEA",
    bgCard: "#FFFFFF",
    accent: "#1f6feb",
    text: "#1a1a1a",
    textSub: "#4b5563",
    border: "rgba(0,0,0,0.06)",
    timeline: "rgba(31,111,235,0.12)",
  },
};

const experience = [
  {
    title: "YEEAP AI – AI Studies",
    time: "03/2026 - Present",
    location: "Online",
    desc: "Studying modern AI systems, LLMs, and real-world AI applications.",
  },
  {
    title: "10 Academy × Kifiya",
    time: "12/2025 – 03/2026",
    location: "Addis Ababa, Ethiopia",
    desc: "Data Engineering, Machine Learning, MLOps, RAG systems, and pipelines.",
  },
  {
    title: "ISHUB AI Workshop",
    time: "02/2026 – 03/2026",
    location: "Addis Ababa, Ethiopia",
    desc: "RAG systems, LLM limitations, and AI assistant projects.",
  },
  {
    title: "CodeAlpha Internship",
    time: "09/2025 – 11/2025",
    location: "Remote",
    desc: "MERN stack backend development and API systems.",
  },
];

const education = [
  {
    title: "Addis Ababa University",
    time: "Expected 06/2027",
    desc: "Bachelor of Information Science",
  },
  {
    title: "ISHUB Backend Camp",
    time: "07/2025 – 09/2025",
    desc: "Express.js & MongoDB backend development",
  },
  {
    title: "Evangadi Full-Stack Program",
    time: "01/2025 – 04/2025",
    desc: "Full-stack web development",
  },
];
export default function AboutPage({ theme = "dark" }) {
  const t = THEMES[theme] || THEMES.dark;
  return (
    <div
      className="about-container"
      style={{
        background: `radial-gradient(circle at top, ${t.bg}, ${t.bgNav})`,
        color: t.text,
        // expose CSS vars for AboutPage.css to consume
        ["--accent"]: t.accent,
        ["--text"]: t.text,
        ["--text-sub"]: t.textSub,
        ["--border"]: t.border,
        ["--timeline"]: t.timeline,
      }}
    >

      {/* TOP: About Me (full width) */}
      <div className="about-top">
        <AboutMe />
      </div>

      {/* BOTTOM: two columns side-by-side */}
      <div className="about-grid">
        <section className="about-section">
          <h2>Experience</h2>
          <Timeline data={experience} />
        </section>

        <section className="about-section">
          <h2>Education</h2>
          <Timeline data={education} />
        </section>
      </div>
    </div>
  );
}

/* Timeline Component */
function Timeline({ data }) {
  return (
    <div className="timeline">
      {data.map((item, i) => (
        <div className="timeline-item" key={i}>
          <h4>{item.title}</h4>
          <small>
            {item.time} {item.location ? `| ${item.location}` : ""}
          </small>
          <p>{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

