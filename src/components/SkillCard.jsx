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
 *   compact     {boolean}  — dense square tile instead of the tall card
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
  compact = false,
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

  /* Compact: a square tile — icon, name, then the level bar pinned to the
     bottom edge. Category moves to the tooltip to keep the square clean. */
  if (compact) {
    return (
      <div
        title={category ? `${name} — ${category} · ${level}%` : `${name} — ${level}%`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          aspectRatio: "1 / 1",
          /* Safety floor: at narrow column widths the square came out shorter
             than its own contents, and overflow:hidden sliced the skill name
             in half. This guarantees icon + two-line name + bar + % always
             fit, whatever the column width. */
          minHeight: 112,
          /* Tiles sit ON the panel, so they recess slightly rather than lift —
             the light values are nudged up because the panel behind them is
             now white, where 0.015 was effectively invisible. */
          background: hovered
            ? dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.045)"
            : dark ? "rgba(255,255,255,0.022)" : "rgba(0,0,0,0.028)",
          border: `1px solid ${hovered ? `${accent}55` : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
          borderRadius: 12,
          padding: "10px 8px 9px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          minWidth: 0,
          cursor: "default",
          position: "relative",
          overflow: "hidden",
          boxShadow: hovered ? `0 6px 20px ${accent}1F` : "none",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition: "transform 0.2s, border-color 0.2s, background 0.2s, box-shadow 0.2s",
        }}
      >
        {/* Accent wash that blooms up from the base on hover */}
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `radial-gradient(80% 60% at 50% 118%, ${accent}22, transparent 70%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.25s",
          }}
        />

        <div
          style={{
            width: 30, height: 30, borderRadius: 9, flexShrink: 0,
            background: hovered ? `${accent}22` : dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.045)",
            border: `1px solid ${hovered ? `${accent}44` : "transparent"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, zIndex: 1,
            transition: "background 0.22s, border-color 0.22s, transform 0.22s",
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        >
          {iconUrl ? (
            <img src={iconUrl} alt="" width={19} height={19} style={{ objectFit: "contain" }} />
          ) : (
            <span>{icon}</span>
          )}
        </div>

        {/* Fixed two-line box so one-word and two-word names line their bars
            up at the same height across the grid. */}
        <div
          style={{
            width: "100%", height: 27, zIndex: 1, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 11,
              color: hovered ? accent : textPrimary,
              letterSpacing: "-0.01em", transition: "color 0.2s",
              textAlign: "center", lineHeight: 1.2,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
              overflow: "hidden", wordBreak: "break-word",
            }}
          >
            {name}
          </span>
        </div>

        <div style={{ width: "100%", zIndex: 1 }}>
          <div style={{ height: 3, background: barBg, borderRadius: 99, overflow: "hidden" }}>
            <div
              style={{
                height: "100%", width: `${level}%`, borderRadius: 99,
                background: hovered
                  ? `linear-gradient(90deg, ${accent}, ${accent}BB)`
                  : `linear-gradient(90deg, ${accent}99, ${accent}44)`,
                transition: "width 0.6s ease, background 0.2s",
              }}
            />
          </div>
          <div
            style={{
              marginTop: 4, textAlign: "center",
              fontSize: 9.5, fontWeight: 700,
              color: hovered ? accent : textMuted, transition: "color 0.2s",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {level}%
          </div>
        </div>
      </div>
    );
  }

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
