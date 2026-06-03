import React from "react";

export default function AboutMe() {
  return (
    <section style={{ padding: "clamp(20px, 4vw, 40px) 0", maxWidth: 820, width: "100%", minWidth: 0 }}>
      <h1
        style={{
          fontSize: "clamp(2rem, 4vw, 2.75rem)",
          marginBottom: 16,
          color: "var(--text, #ffffff)",
          background: "linear-gradient(90deg, var(--accent, #60a5fa), var(--text-sub, #cbd5e1))",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        About Me
      </h1>

      <p style={{ maxWidth: "800px", lineHeight: "1.75", marginBottom: 16, color: "var(--text-sub, #cbd5e1)", overflowWrap: "break-word" }}>
        I am <strong>Chekole Ngusalem</strong>, a Backend-leaning Full-Stack Developer
        and AI enthusiast based in Addis Ababa, Ethiopia.
      </p>

      <p style={{ maxWidth: "800px", lineHeight: "1.75", marginBottom: 16, color: "var(--text-sub, #cbd5e1)", overflowWrap: "break-word" }}>
        I build scalable web apps and AI systems using Node.js, React, and Python. I focus on
        clean backend architectures, reliable APIs, and pragmatic AI integrations (RAG).
      </p>

      <p style={{ maxWidth: "800px", lineHeight: "1.75", color: "var(--text-sub, #cbd5e1)", overflowWrap: "break-word" }}>
        Interests: backend engineering, ML, and practical systems for education and automation.
      </p>
    </section>
  );
}