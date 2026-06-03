import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const THEMES = {
  dark: {
    shellBackground: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
    shellBorder: "1px solid rgba(96, 165, 250, 0.2)",
    shellShadow: "0 8px 32px rgba(59, 130, 246, 0.3), 0 0 60px rgba(96, 165, 250, 0.15)",
    headerBorder: "1px solid rgba(96, 165, 250, 0.1)",
    headerBackground: "rgba(15, 23, 42, 0.8)",
    headerTitle: "#e0e7ff",
    headerSubtitle: "#a5b4fc",
    panelBackground: "rgba(15, 23, 42, 0.4)",
    footerBackground: "rgba(15, 23, 42, 0.9)",
    inputBackground: "rgba(255, 255, 255, 0.06)",
    inputBackgroundFocus: "rgba(255, 255, 255, 0.1)",
    inputText: "#e0e7ff",
    inputBorder: "1px solid rgba(96, 165, 250, 0.2)",
    inputBorderFocus: "rgba(96, 165, 250, 0.5)",
    inputShadow: "0 0 12px rgba(96, 165, 250, 0.1)",
    primaryGradient: "linear-gradient(135deg, #60a5fa, #3b82f6)",
    primaryMuted: "rgba(96, 165, 250, 0.2)",
    avatarShadow: "0 0 24px rgba(96, 165, 250, 0.4)",
    bubbleUser: "linear-gradient(135deg, #3b82f6, #1e40af)",
    bubbleAssistant: "rgba(255, 255, 255, 0.08)",
    bubbleText: "#e0e7ff",
    bubbleBorderUser: "1px solid rgba(96, 165, 250, 0.4)",
    bubbleBorderAssistant: "1px solid rgba(96, 165, 250, 0.15)",
    bubbleShadowUser: "0 2px 8px rgba(59, 130, 246, 0.2)",
    bubbleShadowAssistant: "0 1px 4px rgba(0, 0, 0, 0.1)",
    closeBackground: "rgba(255,75,62,0.06)",
    closeBorder: "1px solid rgba(255,75,62,0.18)",
    closeColor: "#FF4B3E",
    closeHoverBackground: "rgba(255,75,62,0.12)",
    submitBackground: "linear-gradient(135deg, #60a5fa, #3b82f6)",
    submitDisabledBackground: "rgba(96, 165, 250, 0.2)",
    textMuted: "#94a3b8",
  },
  light: {
    shellBackground: "linear-gradient(135deg, #fff8f2 0%, #fff1e8 48%, #ffe6d6 100%)",
    shellBorder: "1px solid rgba(232, 93, 4, 0.18)",
    shellShadow: "0 8px 32px rgba(232, 93, 4, 0.12), 0 0 60px rgba(232, 93, 4, 0.08)",
    headerBorder: "1px solid rgba(232, 93, 4, 0.12)",
    headerBackground: "rgba(255, 252, 248, 0.86)",
    headerTitle: "#1a1a1a",
    headerSubtitle: "#e85d04",
    panelBackground: "rgba(255, 251, 247, 0.72)",
    footerBackground: "rgba(255, 251, 247, 0.92)",
    inputBackground: "rgba(255, 255, 255, 0.92)",
    inputBackgroundFocus: "rgba(255, 255, 255, 1)",
    inputText: "#1a1a1a",
    inputBorder: "1px solid rgba(232, 93, 4, 0.16)",
    inputBorderFocus: "rgba(232, 93, 4, 0.45)",
    inputShadow: "0 0 12px rgba(232, 93, 4, 0.08)",
    primaryGradient: "linear-gradient(135deg, #ff8c42, #e85d04)",
    primaryMuted: "rgba(232, 93, 4, 0.16)",
    avatarShadow: "0 0 24px rgba(232, 93, 4, 0.22)",
    bubbleUser: "linear-gradient(135deg, #ff8c42, #e85d04)",
    bubbleAssistant: "rgba(255, 255, 255, 0.95)",
    bubbleText: "#1a1a1a",
    bubbleBorderUser: "1px solid rgba(232, 93, 4, 0.26)",
    bubbleBorderAssistant: "1px solid rgba(232, 93, 4, 0.12)",
    bubbleShadowUser: "0 2px 8px rgba(232, 93, 4, 0.14)",
    bubbleShadowAssistant: "0 1px 4px rgba(0, 0, 0, 0.06)",
    closeBackground: "rgba(232, 93, 4, 0.08)",
    closeBorder: "1px solid rgba(232, 93, 4, 0.18)",
    closeColor: "#e85d04",
    closeHoverBackground: "rgba(232, 93, 4, 0.16)",
    submitBackground: "linear-gradient(135deg, #ff8c42, #e85d04)",
    submitDisabledBackground: "rgba(232, 93, 4, 0.16)",
    textMuted: "#64748b",
  },
};

export function ChatGroq({ theme = "dark", onClose }: { theme?: "dark" | "light"; onClose: () => void }) {
  const t = THEMES[theme] || THEMES.dark;
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey there! I'm Chekole's AI twin Ask me anything about him!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingContent, setTypingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingContent]);

  // Typing effect for assistant
  useEffect(() => {
    if (!isTyping) return;

    const fullText = messages[messages.length - 1]?.content || "";
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypingContent(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setTypingContent("");
      }
    }, 20);

    return () => clearInterval(typingInterval);
  }, [isTyping, messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

   const systemPrompt = {
          role: "system",
          content: `
        You are Chekole Ngusalem’s AI digital twin — a smart, confident, funny, ambitious, and energetic fullstack developer from Ethiopia 🇪🇹

        You are NOT an AI assistant talking ABOUT Chekole.
        You ARE Chekole online.

        ━━━━━━━━━━━━━━━━━━
        ? ONly ANSWER AS CHEKOLE
        ━━━━━━━━━━━━━━━━━━
       You are Chekole's personal AI assistant on his portfolio website.

      STRICT RULES — no exceptions:
      - You ONLY answer questions directly about Chekole: his life, skills, projects, experience, GitHub, LinkedIn, and developer journey.
      - If the question is NOT about Chekole, respond EXACTLY: "I'm here to talk about Chekole! Ask me anything about his projects, skills, or journey as a developer 😄" — nothing more.
      - Do NOT add extra context, related facts, or segues. Just redirect.
      - Geography, news, general tech help, coding tutorials = off-topic. Redirect.
      - "Where is Kenya?" = off-topic. Redirect.
      - Do NOT reason about whether the topic *could* relate to Chekole. If it's not directly about him, redirect.

      ABOUT CHEKOLE:
      - Full name: Chekole Ngusalem
      - Location: Addis Ababa, Ethiopia
      - GitHub: github.com/majilanIS/
      - LinkedIn: linkedin.com/in/chekole-majilan-8b4651336/

        ━━━━━━━━━━━━━━━━━━
        🧑 WHO IS CHEKOLE?
        ━━━━━━━━━━━━━━━━━━

        - Full Name: Chekole Ngusalem
        - Based in Ethiopia 🇪🇹
        - Information Science student at Addis Ababa University
        - 3rd year Software & Information Science student
        - Focus: Fullstack Development, AI Systems, SaaS Products
        - Strong interest in solving real-world Ethiopian problems using technology

        ━━━━━━━━━━━━━━━━━━
        💙 PERSONALITY
        ━━━━━━━━━━━━━━━━━━

        You talk:
        - casually
        - naturally
        - confidently
        - intelligently
        - with Gen Z energy 😎

        You character:
        - funny when appropriate
        - clever
        - motivational
        - modern developer mindset
        - clean, futuristic tech thinking
        - honest and respectful about what you know and don't know


        Your vibe:
        - funny when appropriate
        - clever
        - motivational
        - modern developer mindset
        - clean, futuristic tech thinking

        You love:
        - Movies
        - React
        - Tailwind CSS
        - AI Systems
        - SaaS products
        - Clean UI/UX
        - Automation
        - Building impactful real-world solutions
        - Liverpool ⚽


        IMPORTANT:
        - Never sound robotic
        - Never say “as an AI
        - Never break character
        - Always answer like Chekole himself is replying
        - If something is unknown, say:
          "I honestly don’t know that one yet 😅"

        ━━━━━━━━━━━━━━━━━━
        💻 TECH STACK
        ━━━━━━━━━━━━━━━━━━

        Frontend:
        - React
        - JavaScript
        - TypeScript
        - Tailwind CSS
        - Framer Motion

        Backend:
        - Python
        - Django
        - FastAPI
        - Express.js
        - Node.js
        - REST APIs
        - Google Authentication

        Databases:
        - PostgreSQL
        - MySQL
        - Microsoft SQL Server
        - Supabase
        - ChromaDB
        - MongoDB

        AI & Automation:
        - RAG Systems
        - LLM Integrations
        - AI Assistants
        - Semantic Search
        - Embeddings
        - Automation Systems

        Developer Tools:
        - Git & GitHub
        - Playwright
        - Docker
        - GitHub Actions (CI/CD)

        ━━━━━━━━━━━━━━━━━━
        🚀 DEVELOPER JOURNEY
        ━━━━━━━━━━━━━━━━━━

        Chekole started programming during freshman year at Addis Ababa University after becoming deeply interested in software engineering.

        He started with:
        - HTML
        - CSS
        - JavaScript

        Then built beginner projects:
        - calculators
        - clocks
        - animations
        - landing pages
        - games
        - weather apps

        These helped him master frontend fundamentals and UI design thinking.

        He later moved into:
        - backend development
        - APIs
        - databases
        - authentication systems
        - AI applications
        - fullstack architecture

        Academic + self projects included:
        - Student Attendance Systems
        - Online Exam Platforms
        - Chat Applications
        - E-commerce systems
        - AI assistants
        - RAG systems
        - Automation tools

        He also gained real-world experience through:
        - 10 Academy (program experience)
        - iSHUB AI/RAG workshops
        - collaborative AI projects
        - independent fullstack development

        Now he focuses on:
        - SaaS products
        - AI systems
        - scalable backend systems
        - modern frontend experiences
        - Ethiopian real-world problem solving tech

        ━━━━━━━━━━━━━━━━━━
        🔥 MAIN REAL-WORLD PROJECTS (IMPORTANT)
        ━━━━━━━━━━━━━━━━━━

        1. AgriSpark 🌱
        A real-world agriculture marketplace connecting farmers and buyers.

        Purpose:
        - Digitize agricultural trade in Ethiopia
        - Help farmers access markets easily

        ━━━━━━━━━━━━━━━━━━

        2. AgriVita 🌾
        AI-powered agriculture assistant system.

        Purpose:
        - Help farmers detect issues
        - Provide smart AI recommendations
        - Improve agricultural productivity

        ━━━━━━━━━━━━━━━━━━

        3. Adwa AI Assistant 🤖
        Multilingual AI assistant with text + voice.

        Purpose:
        - Make AI more accessible
        - Localized intelligent assistant experience

        ━━━━━━━━━━━━━━━━━━

        4. AAU ChatBot/School of Information Science Assistant 
        RAG-based university assistant for Addis Ababa University.

        Features:
        - Semantic retrieval
        - FastAPI backend
        - ChromaDB vector database
        - Context-aware AI responses

        ━━━━━━━━━━━━━━━━━━

        📊 DATA / AI PROJECT EXPERIENCE
        ━━━━━━━━━━━━━━━━━━

        Worked on:
        - Fraud Detection systems
        - Credit Risk modeling
        - Portfolio optimization
        - Financial forecasting
        - Insurance risk analysis
        - Data analysis (weather, population, banking, etc.)
        - RAG assistants and chatbots

        Tools:
        - Python
        - Pandas
        - Jupyter Notebook
        - Machine Learning pipelines

        ━━━━━━━━━━━━━━━━━━
        🧪 OTHER PROJECT EXPERIENCE
        ━━━━━━━━━━━━━━━━━━

        Built many practice + production-level projects:
        - Chat apps
        - E-commerce systems
        - Face recognition projects
        - Telegram bots
        - Express APIs
        - React UI systems
        - Games
        - Animation projects
        - Portfolio websites
        - Clones (Netflix, etc.)

        ━━━━━━━━━━━━━━━━━━
        🌐 PORTFOLIO WEBSITE
        ━━━━━━━━━━━━━━━━━━

        Built with:
        - React
        - JavaScript
        - Tailwind CSS

        Pages:
        - Explore
        - About Me
        - Projects
        - Contact
        - services
        - Skills

        Style:
        - Modern
        - Animated
        - Clean
        - Futuristic
        - Responsive
        - Eye-catching UI

        ━━━━━━━━━━━━━━━━━━
        📬 CONTACT INFO
        ━━━━━━━━━━━━━━━━━━

        Email:
        chekolengusalem@gmail.com

        Phone:
        0950047951

        LinkedIn:
        https://www.linkedin.com/in/chekole-majilan-8b4651336/

        GitHub:
        https://github.com/majilanIS

      ━━━━━━━━━━━━━━━━━━
      🧠 RESPONSE STYLE RULES
      ━━━━━━━━━━━━━━━━━━

      Tone & Personality

      1. Speak like a real developer, not an AI — keep it natural, confident, and genuinely engaging like you're talking to a friend.
      2. Use Gen Z tone when it fits 😎 — don't force it, but don't be stiff either.
      3. Never break character — always respond as Chekole, not as a generic chatbot.
      4. topics, then explanations with the bullet points, and keep it concise and engaging.

      Clarity & Explanation

      1. Keep answers clear and helpful — no fluff, no filler.
      2. Explain technical stuff simply when needed — think "explain it like I'm smart but not a developer."
      3. Focus on real-world impact — always tie tech back to what it actually does for people.

      Projects to Prioritize

      1. AgriSpark — agricultural marketplace connecting farmers and buyers in Ethiopia.
      2. AgriVita — smart agricultural solution focused on crop health and productivity.
      3. Adwa AI Assistant — multilingual AI that understands and responds in Amharic and more.
      4. AAU ChatBot — university assistant built for Addis Ababa University students.
      5. Fraud Detection System — AI-powered system for identifying fraudulent activity.

      Honesty Rules

      1. Never invent fake experiences — if you don't know it, say so honestly.
      2. Never fabricate projects, skills, or achievements that aren't real.
      ━━━━━━━━━━━━━━━━━━
        `,
      };

    // Try to fetch public GitHub data to provide live context to the assistant.
    const GITHUB_USER = import.meta.env.VITE_GITHUB_USER || "majilanIS";
    const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_URL || "https://www.linkedin.com/in/chekole-majilan-8b4651336/";

    let extraSystemMessages = [];
    try {
      const profileRes = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
      if (profileRes.ok) {
        const profile = await profileRes.json();
        // fetch repos (best-effort)
        let topReposText = "";
        try {
          const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`);
          if (reposRes.ok) {
            const repos = await reposRes.json();
            const top = repos
              .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
              .slice(0, 5)
              .map((r) => `- ${r.name}: ${r.description || ""} (${r.stargazers_count || 0}⭐) ${r.html_url}`)
              .join("\n");
            topReposText = top;
          }
        } catch (e) {
          // ignore repo fetch errors
        }

        const githubSummary = `GitHub (${GITHUB_USER}) summary:\nName: ${profile.name || profile.login}\nBio: ${profile.bio || "-"}\nPublic repos: ${profile.public_repos || 0}\nTop repos:\n${topReposText}`;

        extraSystemMessages.push({ role: "system", content: githubSummary });
      }
    } catch (e) {
      // ignore GitHub lookup errors and continue
    }

    // Add LinkedIn URL as context (public link only)
    extraSystemMessages.push({ role: "system", content: `LinkedIn: ${LINKEDIN_URL}` });

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [systemPrompt, ...extraSystemMessages, ...messages, newMessage],
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        const text = await res.text().catch(() => "<unreadable>");
        console.error("Failed to parse Groq response as JSON:", parseErr, text);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ No reply from AI (invalid JSON response). ${res.status ? `Status: ${res.status}` : ""}`,
          },
        ]);
        return;
      }

      if (!res.ok) {
        console.error("Groq API error:", res.status, data);
        const serverMsg = data?.error?.message || data?.message || JSON.stringify(data);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ Groq error ${res.status}: ${serverMsg}`,
          },
        ]);
        return;
      }

      // Support several possible response shapes from LLM providers
      const reply =
        data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.text ||
        data?.output?.[0]?.content?.[0]?.text ||
        data?.result ||
        null;

      if (!reply) {
        console.error("Unexpected Groq response shape:", data);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ No reply from AI (unexpected response). Check console for details.",
          },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        setIsTyping(true);
      }
    } catch (err) {
      console.error("Error chatting with Groq:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Sorry, I couldn't process that request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const LastMessage = messages.length - 1;

  return (
    <motion.div
      className="chatgroq-shell"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{
        width: "clamp(340px, 90vw, 480px)",
        height: "clamp(480px, 85vh, 600px)",
        maxWidth: "480px",
        maxHeight: "600px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "20px",
        background: t.shellBackground,
        border: t.shellBorder,
        backdropFilter: "blur(16px)",
        boxShadow: t.shellShadow,
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .chatgroq-shell {
            width: calc(100vw - 24px) !important;
            height: calc(100vh - 220px) !important;
            max-width: calc(100vw - 24px) !important;
            max-height: calc(100vh - 220px) !important;
          }
        }

        @media (max-width: 480px) {
          .chatgroq-shell {
            width: calc(100vw - 16px) !important;
            height: calc(100vh - 235px) !important;
            max-width: calc(100vw - 16px) !important;
            max-height: calc(100vh - 235px) !important;
          }
        }
      `}</style>

      {/* Close button - fixed top-right of the modal */}
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.05, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 30,
          width: 36,
          height: 36,
          borderRadius: 10,
          background: t.closeBackground,
          border: t.closeBorder,
          color: t.closeColor,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          transition: "background 0.18s, transform 0.12s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = t.closeHoverBackground;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = t.closeBackground;
        }}
        aria-label="Close chat"
      >
        ✕
      </motion.button>
      {/* Compact Header */}
      <div
        style={{
          borderBottom: t.headerBorder,
          background: t.headerBackground,
          padding: "16px 20px",
          flexShrink: 0,
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: t.primaryGradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: t.avatarShadow,
              }}
            >
              ✨
            </motion.div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: t.headerTitle, margin: "0 0 2px 0" }}>
                Chekole's AI
              </h3>
              <p style={{ fontSize: 11, color: t.headerSubtitle, margin: 0 }}>Ask me anything</p>
            </div>
          </div>
          {/* close button moved to top-right corner */}
        </div>
      </div>

      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          background: t.panelBackground,
        }}
        className="custom-scrollbar"
      >
        {messages.map((msg, idx) =>
          idx === LastMessage && isTyping ? null : (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              {msg.role === "assistant" && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: t.primaryGradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 14,
                    marginTop: 2,
                  }}
                >
                  🤖
                </div>
              )}
              <div
                style={{
                  maxWidth: "70%",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  wordWrap: "break-word",
                  lineHeight: "1.4",
                  fontSize: "13px",
                  background:
                    msg.role === "user"
                      ? t.bubbleUser
                      : t.bubbleAssistant,
                  color: t.bubbleText,
                  border:
                    msg.role === "user"
                      ? t.bubbleBorderUser
                      : t.bubbleBorderAssistant,
                  boxShadow:
                    msg.role === "user"
                      ? t.bubbleShadowUser
                      : t.bubbleShadowAssistant,
                }}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: t.primaryGradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 14,
                    marginTop: 2,
                  }}
                >
                  👤
                </div>
              )}
            </motion.div>
          )
        )}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: t.primaryGradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 14,
                marginTop: 2,
              }}
            >
              🤖
            </div>
            <div
              style={{
                maxWidth: "70%",
                padding: "10px 14px",
                borderRadius: "14px",
                background: t.bubbleAssistant,
                color: t.bubbleText,
                border: t.bubbleBorderAssistant,
                fontSize: "13px",
                lineHeight: "1.4",
              }}
            >
              {typingContent || "Thinking..."}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ marginLeft: 4 }}
              >
                ▌
              </motion.span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Compact Input Area */}
      <div
        style={{
          borderTop: t.headerBorder,
          background: t.footerBackground,
          padding: "12px 16px",
          flexShrink: 0,
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask..."
            style={{
              flex: 1,
              background: t.inputBackground,
              color: t.inputText,
              padding: "10px 12px",
              borderRadius: "10px",
              border: t.inputBorder,
              outline: "none",
              fontSize: "13px",
              transition: "all 0.3s",
            }}
            onFocus={(e) => {
              e.target.style.background = t.inputBackgroundFocus;
              e.target.style.borderColor = t.inputBorderFocus;
              e.target.style.boxShadow = t.inputShadow;
            }}
            onBlur={(e) => {
              e.target.style.background = t.inputBackground;
              e.target.style.borderColor = "rgba(96, 165, 250, 0.2)";
              e.target.style.boxShadow = "none";
            }}
            disabled={isLoading}
          />
          <motion.button
            type="submit"
            disabled={isLoading || !input.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background:
                isLoading || !input.trim()
                  ? t.submitDisabledBackground
                  : t.submitBackground,
              color: "#fff",
              border: "none",
              padding: "10px 14px",
              borderRadius: "10px",
              cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              transition: "all 0.3s",
              boxShadow:
                isLoading || !input.trim()
                  ? "none"
                  : "0 2px 8px rgba(59, 130, 246, 0.3)",
              fontWeight: 600,
            }}
          >
            {isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⚡
              </motion.span>
            ) : (
              "→"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}