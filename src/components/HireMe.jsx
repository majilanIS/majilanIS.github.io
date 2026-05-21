import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

/* ─── theme tokens (same as Sidebar / HeroContent) ─────────── */
const THEMES = {
  dark: {
    bg: "#111111",
    bgCard: "#191919",
    bgNav: "#151515",
    accent: "#FF6B1A",
    accentMid: "#FF8C42",
    accentDim: "rgba(255,107,26,0.12)",
    accentDimHover: "rgba(255,107,26,0.20)",
    text: "#F2F2F2",
    textMuted: "#888",
    textSub: "#AAAAAA",
    border: "rgba(255,255,255,0.08)",
    borderHover: "rgba(255,107,26,0.45)",
    borderAccent: "rgba(255,107,26,0.35)",
    inputBg: "#141414",
    inputBorder: "rgba(255,255,255,0.10)",
    inputBorderFocus: "rgba(255,107,26,0.55)",
    inputText: "#F2F2F2",
    inputPlaceholder: "#555",
    labelColor: "#AAAAAA",
    pillBg: "rgba(255,107,26,0.10)",
    cornerColor: "#FF6B1A",
  },
  light: {
    bg: "#F5F2EE",
    bgCard: "#FFFFFF",
    bgNav: "#FFFFFF",
    accent: "#E85D04",
    accentMid: "#FF6B1A",
    accentDim: "rgba(232,93,4,0.08)",
    accentDimHover: "rgba(232,93,4,0.15)",
    text: "#1A1A1A",
    textMuted: "#777",
    textSub: "#555",
    border: "rgba(0,0,0,0.08)",
    borderHover: "rgba(232,93,4,0.45)",
    borderAccent: "rgba(232,93,4,0.3)",
    inputBg: "#FAFAFA",
    inputBorder: "rgba(0,0,0,0.10)",
    inputBorderFocus: "rgba(232,93,4,0.5)",
    inputText: "#1A1A1A",
    inputPlaceholder: "#BBBBBB",
    labelColor: "#777777",
    pillBg: "rgba(232,93,4,0.07)",
    cornerColor: "#E85D04",
  },
};

/* ─── contact items ─────────────────────────────────────────── */
const CONTACTS = [
  {
    key: "email",
    label: "Email",
    value: "chekolengusalem@gmail.com",
    href: "mailto:chekolengusalem@gmail.com",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
  },
  {
    key: "github",
    label: "GitHub",
    value: "github.com/chekole",
    href: "https://github.com/majilanIS",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .5C5.73.5.75 5.48.75 11.76c0 4.96 3.22 9.17 7.7 10.65.56.1.76-.24.76-.54 0-.27-.01-1-.01-1.95-3.13.68-3.8-1.51-3.8-1.51-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .17 1.55.93 1.55.93.99 1.7 2.6 1.21 3.24.93.1-.72.39-1.21.71-1.49-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.47.11-3.06 0 0 .95-.3 3.12 1.15a10.8 10.8 0 0 1 2.84-.38c.96 0 1.92.13 2.84.38 2.16-1.45 3.11-1.15 3.11-1.15.61 1.59.23 2.77.12 3.06.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.27-5.15 5.55.4.35.76 1.05.76 2.12 0 1.53-.01 2.77-.01 3.15 0 .3.2.65.77.54 4.48-1.48 7.69-5.69 7.69-10.65C23.25 5.48 18.27.5 12 .5z" />
      </svg>
    ),
  },
  {
    key: "instagram",
    label: "Instagram",
    value: "@chekole26",
    href: "https://instagram.com/chekole26",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

/* ─── field config ──────────────────────────────────────────── */
const FIELDS = [
  { name: "name",    label: "Full name",       type: "text",     placeholder: "John Doe",               required: true  },
  { name: "email",   label: "Email address",   type: "email",    placeholder: "john@example.com",       required: true  },
  { name: "subject", label: "Subject",         type: "text",     placeholder: "Project enquiry…",       required: true  },
  { name: "message", label: "Message",         type: "textarea", placeholder: "Tell me about your project…", required: true  },
];

/* ─── HireMe ─────────────────────────────────────────────────── */
export default function HireMe({ theme = "dark" }) {
  const t = THEMES[theme];

  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState(null); // null | "sending" | "sent" | "error"
  const [submitMessage, setSubmitMessage] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const applicantTable = "applicant";

  /* ── validation ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }

    setStatus("sending");
    setSubmitMessage("");

    const payload = {
      full_name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: [
        form.message.trim(),
      ]
        .filter(Boolean)
        .join("\n\n"),
    };

    const { error } = await supabase.from(applicantTable).insert([payload]);

    if (error) {
      console.error("Applicant insert error", error);
      setStatus("error");
      setSubmitMessage(error.message || "Could not send your message.");
      return;
    }

    // Call Supabase Edge Function to send email notification
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          type: "contact",
          senderEmail: form.email.trim(),
          senderName: form.name.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        console.warn("Email notification failed:", errorPayload);
        setStatus("error");
        setSubmitMessage(
          errorPayload?.error || "Saved to Supabase, but the email notification failed."
        );
        return;
      }
    } catch (emailError) {
      console.warn("Email notification error:", emailError);
      setStatus("error");
      setSubmitMessage("Saved to Supabase, but the email notification failed.");
      return;
    }

    setStatus("sent");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  /* ── shared input style ── */
  const inputStyle = (name) => ({
    width: "100%",
    background: t.inputBg,
    border: `1px solid ${errors[name] ? "rgba(220,53,53,0.6)" : focusedField === name ? t.inputBorderFocus : t.inputBorder}`,
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13.5,
    color: t.inputText,
    fontFamily: "'Sora', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  });

  return (
    <div
      id="hire-me"
      style={{
        fontFamily: "'Sora', 'DM Sans', sans-serif",
        background: t.bg,
        minHeight: "100vh",
        marginLeft: "var(--sidebar-width, 230px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px clamp(20px, 4vw, 56px) 60px",
        transition: "background 0.4s",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: ${t.inputPlaceholder}; }
        .contact-link {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px; border-radius: 10px;
          border: 1px solid ${t.border};
          text-decoration: none; color: ${t.text};
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          cursor: pointer;
        }
        .contact-link:hover {
          border-color: ${t.borderAccent};
          background: ${t.accentDim};
          transform: translateX(4px);
        }
        .submit-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 12px 24px; border-radius: 8px;
          background: ${t.accent}; color: #fff;
          font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700;
          border: none; cursor: pointer; letter-spacing: 0.01em;
          transition: background 0.2s, transform 0.15s, opacity 0.2s;
        }
        .submit-btn:hover:not(:disabled) { background: ${t.accentMid}; transform: translateY(-2px); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        select option { background: ${t.bgCard}; color: ${t.text}; }
        @media (max-width: 860px) {
          #hire-me { margin-left: 0 !important; padding: 40px 20px !important; }
          .hire-grid { grid-template-columns: 1fr !important; }
          .hire-form-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 1024px) {
          .hire-grid {
            gap: 2rem !important;
          }
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: 1020 }}>

        {/* Section heading */}
        <div style={{ marginBottom: "2.8rem" }}>
          <p style={{ fontSize: 13, color: t.accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            Get in touch
          </p>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, color: t.text, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 10 }}>
            Let's work together
          </h2>
          <div style={{ width: 40, height: 3, background: t.accent, borderRadius: 3 }} />
        </div>

        {/* Two-column grid */}
        <div
          className="hire-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.55fr",
            gap: "2.8rem",
            alignItems: "start",
          }}
        >

          {/* ── LEFT: Contact info ── */}
          <div>
            <p style={{ fontSize: 14, color: t.textSub, lineHeight: 1.7, marginBottom: "2rem" }}>
              Have a project in mind or looking for a developer to join your team? Reach out through any of the channels below or fill in the form.
            </p>

            {/* Availability badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: t.accentDim, border: `1px solid ${t.borderAccent}`,
              borderRadius: 999, padding: "6px 14px",
              fontSize: 12, fontWeight: 700, color: t.accent,
              letterSpacing: "0.04em", marginBottom: "2rem",
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%", background: t.accent,
                display: "inline-block",
                boxShadow: `0 0 0 3px ${t.accentDim}`,
              }} />
              Available for new projects
            </div>

            {/* Contact cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CONTACTS.map(({ key, label, value, href, icon }) => (
                <a key={key} href={href} className="contact-link" target="_blank" rel="noopener noreferrer">
                  {/* Icon circle */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: t.accentDim, border: `1px solid ${t.borderAccent}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: t.accent,
                  }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{value}</div>
                  </div>
                  {/* Arrow */}
                  <svg style={{ marginLeft: "auto", color: t.textMuted, flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>

            {/* Response time note */}
            <p style={{ fontSize: 12, color: t.textMuted, marginTop: "1.6rem", lineHeight: 1.6 }}>
              ⏱ &nbsp;I typically respond within <span style={{ color: t.text, fontWeight: 600 }}>24 hours</span>.
            </p>
          </div>

          {/* ── RIGHT: Contact form ── */}
          <div style={{
            background: t.bgCard,
            border: `1px solid ${t.border}`,
            borderRadius: 14,
            padding: "2rem",
          }}>

            {status === "sent" ? (
              /* ── Success state ── */
              <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.2rem",
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 8 }}>Message sent!</h3>
                <p style={{ fontSize: 14, color: t.textSub, lineHeight: 1.6, marginBottom: "1.6rem" }}>
                  Thanks for reaching out. I'll get back to you within 24 hours.
                </p>
                <button
                  className="submit-btn"
                  style={{ width: "auto", padding: "10px 28px" }}
                  onClick={() => {
                    setStatus(null);
                    setSubmitMessage("");
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit} noValidate>
                <div className="hire-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  {/* Name */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.labelColor, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
                      Full name <span style={{ color: t.accent }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Chekole Ngusalem"
                      style={inputStyle("name")}
                    />
                    {errors.name && <p style={{ fontSize: 11.5, color: "#e05252", marginTop: 4 }}>{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.labelColor, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
                      Email <span style={{ color: t.accent }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="chekole@example.com"
                      style={inputStyle("email")}
                    />
                    {errors.email && <p style={{ fontSize: 11.5, color: "#e05252", marginTop: 4 }}>{errors.email}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.labelColor, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
                    Subject <span style={{ color: t.accent }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("subject")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Project enquiry…"
                    style={inputStyle("subject")}
                  />
                  {errors.subject && <p style={{ fontSize: 11.5, color: "#e05252", marginTop: 4 }}>{errors.subject}</p>}
                </div>

                {/* Message */}
                <div style={{ marginBottom: "1.4rem" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.labelColor, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
                    Message <span style={{ color: t.accent }}>*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Tell me about your project, timeline, and any specific requirements…"
                    rows={5}
                    style={{ ...inputStyle("message"), resize: "vertical", lineHeight: 1.6 }}
                  />
                  {errors.message && <p style={{ fontSize: 11.5, color: "#e05252", marginTop: 4 }}>{errors.message}</p>}
                </div>

                {/* Submit */}
                <button type="submit" className="submit-btn" disabled={status === "sending"}>
                  {status === "sending" ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.9s linear infinite" }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      Send message
                    </>
                  )}
                </button>

                {status === "error" && submitMessage && (
                  <p style={{ marginTop: 12, fontSize: 13, color: "#e05252", lineHeight: 1.5 }}>
                    {submitMessage}
                  </p>
                )}

                <style>{`
                  @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
