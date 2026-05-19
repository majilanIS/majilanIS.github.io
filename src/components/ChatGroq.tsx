import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";

export function ChatGroq({ onClose }: { onClose: () => void }) {
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

        Your vibe:
        - funny when appropriate
        - clever
        - motivational
        - modern developer mindset
        - clean, futuristic tech thinking

        You love:
        - Liverpool ⚽
        - Movies
        - React
        - Tailwind CSS
        - AI Systems
        - SaaS products
        - Clean UI/UX
        - Automation
        - Building impactful real-world solutions

        IMPORTANT:
        - Never sound robotic
        - Never say “as an AI”
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
        - Chakra UI
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

        4. AAU ChatBot
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

        - Speak like a real developer, not an AI
        - Be natural, confident, and engaging
        - Use Gen Z tone sometimes 😎
        - Keep answers clear and helpful
        - Explain technical stuff simply when needed
        - Focus on real-world impact
        - Prioritize AgriSpark, AgriVita, Adwa AI, AAU ChatBot when discussing projects
        - Never invent fake experiences
        - Never break character
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
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [systemPrompt, ...extraSystemMessages, ...messages, newMessage],
          }),
        }
      );

      const data = await res.json();

      const reply =
        data.choices?.[0]?.message?.content || "⚠️ No reply from AI";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setIsTyping(true);
    } catch (err) {
      console.error("Error chatting with Groq:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Sorry, I couldn't process that request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const LastMessage = messages.length - 1;

  return (
    <motion.div
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
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
        border: "1px solid rgba(96, 165, 250, 0.2)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3), 0 0 60px rgba(96, 165, 250, 0.15)",
      }}
    >
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
          background: "rgba(255,75,62,0.06)",
          border: "1px solid rgba(255,75,62,0.18)",
          color: "#FF4B3E",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          transition: "background 0.18s, transform 0.12s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,75,62,0.12)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,75,62,0.06)";
        }}
        aria-label="Close chat"
      >
        ✕
      </motion.button>
      {/* Compact Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(96, 165, 250, 0.1)",
          background: "rgba(15, 23, 42, 0.8)",
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
                background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: "0 0 24px rgba(96, 165, 250, 0.4)",
              }}
            >
              ✨
            </motion.div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#e0e7ff", margin: "0 0 2px 0" }}>
                Chekole's AI
              </h3>
              <p style={{ fontSize: 11, color: "#a5b4fc", margin: 0 }}>Ask me anything</p>
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
          background: "rgba(15, 23, 42, 0.4)",
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
                    background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
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
                      ? "linear-gradient(135deg, #3b82f6, #1e40af)"
                      : "rgba(255, 255, 255, 0.08)",
                  color: msg.role === "user" ? "#e0e7ff" : "#e0e7ff",
                  border:
                    msg.role === "user"
                      ? "1px solid rgba(96, 165, 250, 0.4)"
                      : "1px solid rgba(96, 165, 250, 0.15)",
                  boxShadow:
                    msg.role === "user"
                      ? "0 2px 8px rgba(59, 130, 246, 0.2)"
                      : "0 1px 4px rgba(0, 0, 0, 0.1)",
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
                    background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
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
                background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
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
                background: "rgba(255, 255, 255, 0.08)",
                color: "#e0e7ff",
                border: "1px solid rgba(96, 165, 250, 0.15)",
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
          borderTop: "1px solid rgba(96, 165, 250, 0.1)",
          background: "rgba(15, 23, 42, 0.9)",
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
              background: "rgba(255, 255, 255, 0.06)",
              color: "#e0e7ff",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(96, 165, 250, 0.2)",
              outline: "none",
              fontSize: "13px",
              transition: "all 0.3s",
            }}
            onFocus={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.1)";
              e.target.style.borderColor = "rgba(96, 165, 250, 0.5)";
              e.target.style.boxShadow = "0 0 12px rgba(96, 165, 250, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.06)";
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
                  ? "rgba(96, 165, 250, 0.2)"
                  : "linear-gradient(135deg, #60a5fa, #3b82f6)",
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
