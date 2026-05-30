import { useState, useEffect } from "react";

import "./App.css";

import Sidebar from "./components/Sidebar";
import AboutPage from "./components/About";
import HeroContent from "./components/HeroContent";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import HireMe from "./components/HireMe";
import { ChatGroq } from "./components/ChatGroq";
import Services from "./components/Services";
import Certificate from "./components/Certificate";
import Feedback from "./components/Feedback";

function App() {
  const [theme, setTheme] = useState("dark");
  const [chatOpen, setChatOpen] = useState(false);

  // central theme tokens (minimal set used across components/CSS)
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
    },
  };

  // apply CSS variables globally so CSS files and var-based styles update
  useEffect(() => {
    const vars = THEMES[theme] || THEMES.dark;
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(`--${k}`, v));
    root.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
     <div>
       <Sidebar theme={theme} setTheme={setTheme} />

      <HeroContent theme={theme} />

      <AboutPage theme={theme} />

      <Projects theme={theme} />

      <Skills theme={theme} />
      <Services theme={theme} />
      <Certificate theme={theme} />
      <Feedback theme={theme} />

      <HireMe theme={theme} />
      </div>

      {/* Floating AI Chat Button - Fixed at right-bottom for whole portfolio */}
      {!chatOpen && (
        <button
          className="chat-fab"
          onClick={() => setChatOpen(true)}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
            border: "2px solid rgba(96, 165, 250, 0.6)",
            color: "#fff",
            fontSize: 28,
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
            zIndex: 999,
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.15)";
            e.target.style.boxShadow = "0 12px 32px rgba(59, 130, 246, 0.6), inset 0 1px 0 rgba(255,255,255,0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)";
          }}
          aria-label="Open AI Chat"
        >
          ✨
        </button>
      )}

      {/* AI Chat Modal - Fixed positioning for whole portfolio */}
      {chatOpen && (
        <div className="chat-fab-shell">
          <ChatGroq onClose={() => setChatOpen(false)} />
        </div>
      )}
    </>
  );
}

export default App;