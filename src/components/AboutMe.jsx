import React from "react";

export default function AboutMe() {
  return (
    <section style={{ padding: "40px", color: "#fff", fontFamily: "Arial" }}>
      <h1>About Me</h1>

      <p style={{ maxWidth: "800px", lineHeight: "1.6" }}>
        I am <strong>Chekole Ngusalem</strong>, a Backend-leaning Full-Stack Developer
        and AI enthusiast based in Addis Ababa, Ethiopia.
      </p>

      <p style={{ maxWidth: "800px", lineHeight: "1.6" }}>
        I specialize in building scalable web applications and AI-driven systems using
        Node.js, Express, React, and Python. I enjoy designing clean backend architectures,
        developing RESTful APIs, and working with modern databases and AI technologies like RAG.
      </p>

      <p style={{ maxWidth: "800px", lineHeight: "1.6" }}>
        My interests include backend engineering, machine learning, and building real-world
        systems that solve practical problems—especially in agriculture, education, and automation.
      </p>
    </section>
  );
}