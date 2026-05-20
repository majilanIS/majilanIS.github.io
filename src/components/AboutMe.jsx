import React from "react";

export default function AboutMe() {
  return (
    <section style={{ padding: "clamp(20px, 4vw, 40px) 0", maxWidth: 820 }}>
      <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", marginBottom: 16 }}>About Me</h1>

      <p style={{ maxWidth: "800px", lineHeight: "1.75", marginBottom: 16 }}>
        I am <strong>Chekole Ngusalem</strong>, a Backend-leaning Full-Stack Developer
        and AI enthusiast based in Addis Ababa, Ethiopia.
      </p>

      <p style={{ maxWidth: "800px", lineHeight: "1.75", marginBottom: 16 }}>
        I build scalable web apps and AI systems using Node.js, React, and Python. I focus on
        clean backend architectures, reliable APIs, and pragmatic AI integrations (RAG).
      </p>

      <p style={{ maxWidth: "800px", lineHeight: "1.75" }}>
        Interests: backend engineering, ML, and practical systems for education and automation.
      </p>
    </section>
  );
}