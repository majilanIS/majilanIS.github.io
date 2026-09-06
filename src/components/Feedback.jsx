import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const THEMES = {
  dark: {
    bg: "#111111",
    bgCard: "#191919",
    accent: "#FF6B1A",
    accentMid: "#FF8C42",
    accentDim: "rgba(255,107,26,0.12)",
    text: "#F2F2F2",
    textMuted: "#888",
    textSub: "#AAAAAA",
    border: "rgba(255,255,255,0.08)",
    inputBg: "#141414",
    inputBorder: "rgba(255,255,255,0.10)",
    inputBorderFocus: "rgba(255,107,26,0.55)",
    inputText: "#F2F2F2",
    inputPlaceholder: "#555",
    pillBg: "rgba(255,107,26,0.10)",
    pillBorder: "rgba(255,107,26,0.28)",
  },
  light: {
    bg: "#F5F2EE",
    bgCard: "#FFFFFF",
    accent: "#E85D04",
    accentMid: "#FF6B1A",
    accentDim: "rgba(232,93,4,0.08)",
    text: "#1A1A1A",
    textMuted: "#777",
    textSub: "#555",
    border: "rgba(0,0,0,0.08)",
    inputBg: "#FAFAFA",
    inputBorder: "rgba(0,0,0,0.10)",
    inputBorderFocus: "rgba(232,93,4,0.5)",
    inputText: "#1A1A1A",
    inputPlaceholder: "#BBBBBB",
    pillBg: "rgba(232,93,4,0.07)",
    pillBorder: "rgba(232,93,4,0.22)",
  },
};

const STARS = [1, 2, 3, 4, 5];

export default function Feedback({ theme = "dark" }) {
  const t = THEMES[theme] || THEMES.dark;
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [topFeedback, setTopFeedback] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const listRef = useRef(null);

  const activeStars = useMemo(() => hoverRating || rating, [hoverRating, rating]);

  const loadFeedback = async () => {
    setLoadingFeedback(true);

    const { data, error } = await supabase
      .from("feedback")
      .select("id, name, rating, comment, created_at")
      .gt("rating", 3)
      .order("created_at", { ascending: false })
      .limit(8);

    if (!error && data) {
      setTopFeedback(data);

      // ensure the scrollable list shows from the top (newest first)
      requestAnimationFrame(() => {
        try {
          if (listRef.current) listRef.current.scrollTop = 0;
        } catch (e) {
          // ignore
        }
      });
    }

    setLoadingFeedback(false);
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setStatus("error");
      setMessage("Please leave a comment.");
      return;
    }

    setStatus("sending");
    setMessage("");

    const payload = {
      name: name.trim() || null,
      rating,
      comment: comment.trim(),
    };

    const { error } = await supabase.from("feedback").insert([payload]);

    if (error) {
      setStatus("error");
      setMessage(error.message || "Could not save your feedback.");
      return;
    }

    setStatus("sent");
    setName("");
    setComment("");
    setRating(5);
    setHoverRating(0);
    setMessage("Thanks for your feedback!");
    loadFeedback();
  };

  return (
    <section
      id="feedback"
      style={{
        background: "transparent",
        padding: "72px 0 80px",
        fontFamily: "'Sora', sans-serif",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        .feedback-star {
          appearance: none;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 28px;
          line-height: 1;
          padding: 0 2px;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }
        .feedback-star:hover {
          transform: translateY(-1px) scale(1.06);
        }
        .feedback-input {
          width: 100%;
          background: ${t.inputBg};
          border: 1px solid ${t.inputBorder};
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14px;
          color: ${t.inputText};
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          font-family: 'Sora', sans-serif;
        }
        .feedback-input:focus {
          border-color: ${t.inputBorderFocus};
          box-shadow: 0 0 0 3px ${t.accentDim};
        }
        .feedback-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          border-radius: 10px;
          background: ${t.accent};
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          padding: 12px 18px;
          transition: transform 0.15s ease, opacity 0.2s ease, background 0.2s ease;
        }
        .feedback-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          background: ${t.accentMid};
        }
        .feedback-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        @media (max-width: 860px) {
          #feedback {
            width: 100% !important;
            padding: 44px 0 56px !important;
          }

          #feedback .feedback-shell {
            padding: 0 20px !important;
          }

          #feedback .feedback-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="feedback-shell" style={{ width: "100%", margin: 0, padding: "0 clamp(20px, 4vw, 40px)", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: "2.2rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: t.pillBg,
            border: `1px solid ${t.pillBorder}`,
            borderRadius: 999,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 700,
            color: t.accent,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}>
            ⭐ Feedback
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
            fontWeight: 800,
            color: t.text,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: "0 0 0.5rem",
          }}>
            Rate the portfolio and leave a comment
          </h2>
          <p style={{ fontSize: 14, color: t.textSub, maxWidth: "60ch", lineHeight: 1.6 }}>
            Add your rating and a short note. I’ll use this feedback to improve the design, content, and project showcase.
          </p>
        </div>

        <div className="feedback-grid" style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "1.5rem",
          alignItems: "stretch",
        }}>
          <form onSubmit={handleSubmit} style={{
            background: t.bgCard,
            border: `1px solid ${t.border}`,
            borderRadius: 20,
            padding: "1.4rem",
            boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
          }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 10 }}>
                Your rating
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                {STARS.map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="feedback-star"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    aria-label={`${star} star rating`}
                    style={{ color: star <= activeStars ? t.accent : "rgba(128,128,128,0.35)" }}
                  >
                    ★
                  </button>
                ))}
                <span style={{ marginLeft: 10, fontSize: 13, color: t.textMuted }}>
                  {rating}/5
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 8 }}>
                Name <span style={{ color: t.textMuted, fontWeight: 500 }}>(optional)</span>
              </label>
              <input
                className="feedback-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 8 }}>
                Comment
              </label>
              <textarea
                className="feedback-input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell me what you liked or what I should improve..."
                rows={6}
                style={{ resize: "vertical", minHeight: 140 }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button type="submit" className="feedback-btn" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Send feedback"}
              </button>
              {message ? (
                <span style={{ fontSize: 13, color: status === "error" ? "#ef4444" : t.accent, fontWeight: 600 }}>
                  {message}
                </span>
              ) : null}
            </div>
          </form>

          <div style={{
            background: `linear-gradient(180deg, ${t.bgCard}, ${t.bg})`,
            border: `1px solid ${t.border}`,
            borderRadius: 20,
            padding: "1.4rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 16,
          }}>
            <div>
              <h3 style={{ margin: 0, color: t.text, fontSize: 18, fontWeight: 800 }}>Rating Lists</h3>
              <p style={{ marginTop: 8, color: t.textSub, fontSize: 14, lineHeight: 1.6 }}>
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 360, overflowY: "auto", paddingRight: 4 }}>
              {loadingFeedback ? (
                <div style={{ color: t.textMuted, fontSize: 14 }}>Loading reviews...</div>
              ) : topFeedback.length ? (
                topFeedback.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      borderRadius: 16,
                      background: t.bgCard,
                      border: `1px solid ${t.border}`,
                      padding: 12,
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: t.pillBg,
                        color: t.accent,
                        fontWeight: 800,
                        fontSize: 13,
                        border: `1px solid ${t.pillBorder}`,
                      }}>{idx + 1}</div>
                      <div style={{ display: "flex", gap: 2 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} style={{ color: i < item.rating ? t.accent : "rgba(128,128,128,0.22)", fontSize: 12, lineHeight: 1 }}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <strong style={{ color: t.text, fontSize: 14 }}>{item.name || "Anonymous"}</strong>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: t.accent, fontWeight: 800, fontSize: 13 }}>{item.rating}/5</span>
                        </div>
                      </div>

                      <p style={{ margin: "8px 0 0", color: t.textSub, fontSize: 13, lineHeight: 1.6 }}>
                        {item.comment}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: t.textMuted, fontSize: 14, lineHeight: 1.6 }}>
                  No ratings above 4 yet. Be the first one to leave a strong review.
                </div>
              )}
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
}
