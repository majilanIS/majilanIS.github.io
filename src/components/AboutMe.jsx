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
        I build production-ready web applications, backend systems, and AI-powered solutions
        using Node.js, React, Python, Firebase, PostgreSQL, and MongoDB. My focus is on designing
        reliable APIs, clean backend architectures, data-driven systems, and practical AI
        integrations such as RAG and LLM-powered applications.
      </p>

      <p style={{ maxWidth: "800px", lineHeight: "1.75", marginBottom: 16, color: "var(--text-sub, #cbd5e1)", overflowWrap: "break-word" }}>
        I enjoy working across the stack—from backend services and databases to React
        interfaces and AI pipelines—while keeping a strong focus on solving real-world problems.
      </p>

      <p style={{ maxWidth: "800px", lineHeight: "1.75", marginBottom: 16, color: "var(--text-sub, #cbd5e1)", overflowWrap: "break-word" }}>
        I am also continuously deepening my knowledge of machine learning and deep learning,
        with a focus on understanding model training, evaluation, deployment, and how ML can
        be applied to build more intelligent and useful systems in the future.
      </p>

      <p style={{ maxWidth: "800px", lineHeight: "1.75", color: "var(--text-sub, #cbd5e1)", overflowWrap: "break-word" }}>
        Interests: Backend Engineering, AI/ML, Deep Learning, Data Systems, RAG/LLM
        Applications, Automation, and practical technology for education and business.
      </p>
    </section>
  );
}