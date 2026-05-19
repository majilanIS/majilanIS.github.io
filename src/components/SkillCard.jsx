import { useState } from "react";

/**
 * SkillCard — reusable skill card component
 *
 * Props:
 *   name        {string}   — skill name e.g. "Node.js"
 *   icon        {string}   — emoji or single-char icon e.g. "🟢" or icon URL
 *   iconUrl     {string}   — optional image URL (overrides icon)
 *   level       {number}   — proficiency 0–100
 *   category    {string}   — e.g. "Backend", "AI"
 *   accent      {string}   — hex color for accent (matches theme)
 *   theme       {string}   — "dark" | "light"
 *   delay       {number}   — animation delay in ms
 */
export default function SkillCard({
  name,
  icon = "⚙",
  iconUrl,
  level = 80,
  category = "",
  accent = "#FF6B1A",
  theme = "dark",
  delay = 0,
}) {
  const [hovered, setHovered] = useState(false);

  const dark = theme === "dark";
  const bg = dark ? "#191919" : "#FFFFFF";
  const border = hovered
    ? `1px solid ${accent}66`
    : `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`;
  const textPrimary = dark ? "#F2F2F2" : "#1A1A1A";
  const textMuted = dark ? "#777" : "#888";
  const barBg = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg,
        border,
        borderRadius: 12,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        boxShadow: hovered
          ? `0 8px 32px ${accent}22, 0 2px 8px rgba(0,0,0,0.2)`
          : dark
          ? "0 2px 8px rgba(0,0,0,0.25)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: `all 0.25s ease ${delay}ms`,
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Glow spot on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: hovered
            ? `linear-gradient(90deg, transparent, ${accent}88, transparent)`
            : "transparent",
          transition: "background 0.3s",
        }}
      />

      {/* Top row: icon + category */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 9,
            background: hovered ? `${accent}22` : dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            border: `1px solid ${hovered ? accent + "44" : "transparent"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            transition: "background 0.25s, border-color 0.25s",
            flexShrink: 0,
          }}
        >
          {iconUrl ? (
            <img src={iconUrl} alt={name} width={22} height={22} style={{ objectFit: "contain" }} />
          ) : (
            <span>{icon}</span>
          )}
        </div>

        {category && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: accent,
              background: `${accent}15`,
              border: `1px solid ${accent}30`,
              borderRadius: 999,
              padding: "2px 8px",
            }}
          >
            {category}
          </span>
        )}
      </div>

      {/* Name */}
      <div
        style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 700,
          fontSize: 13.5,
          color: hovered ? accent : textPrimary,
          letterSpacing: "-0.01em",
          transition: "color 0.2s",
          lineHeight: 1.2,
        }}
      >
        {name}
      </div>

      {/* Progress bar */}
      <div>
        <div
          style={{
            height: 3,
            background: barBg,
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${level}%`,
              background: hovered
                ? `linear-gradient(90deg, ${accent}, ${accent}BB)`
                : `linear-gradient(90deg, ${accent}99, ${accent}55)`,
              borderRadius: 99,
              transition: "width 0.6s ease, background 0.25s",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
            fontSize: 10,
            fontWeight: 600,
            color: textMuted,
            letterSpacing: "0.03em",
          }}
        >
          <span>Proficiency</span>
          <span style={{ color: hovered ? accent : textMuted, transition: "color 0.2s" }}>
            {level}%
          </span>
        </div>
      </div>
    </div>
  );
}
