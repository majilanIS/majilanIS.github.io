import StarFlock from "./StarFlock";

/**
 * PageBackdrop — one continuous background for the whole page.
 *
 * Every section used to paint its own opaque fill, which banded the page into
 * visible slabs at each boundary. This is a single fixed layer behind all of
 * them instead: sections are transparent, so the gradient, the aurora and the
 * star flock run unbroken from the top of the hero to the bottom of the
 * contact form. Being fixed also means the flock is one continuous canvas
 * rather than three, so it is cheaper than the per-section version was.
 *
 * Purely decorative: never captures pointer events, always sits at z-index 0
 * with `.main-content` stacked above it.
 *
 * Props:
 *   theme  {string}  "dark" | "light"
 *   accent {string}  hex brand accent
 */
/* Per-theme colour values. Both palettes are rendered; the light one fades
   in and out on top of the dark one. */
const PALETTES = {
  dark: {
    base: "linear-gradient(180deg, #171717 0%, #131313 28%, #101010 62%, #0C0C0C 100%)",
    cool: "#3B82F6",
    orb1: "22", orb2: "16", orb3: "14",
    dot: "rgba(255,255,255,0.05)",
    vignette:
      "radial-gradient(125% 90% at 50% 45%, transparent 40%, rgba(0,0,0,0.32) 100%)",
  },
  light: {
    base: "linear-gradient(180deg, #FBF9F6 0%, #F7F4F0 30%, #F2EFE9 66%, #EBE7E0 100%)",
    cool: "#6366F1",
    orb1: "16", orb2: "10", orb3: "0E",
    dot: "rgba(0,0,0,0.045)",
    vignette:
      "radial-gradient(125% 90% at 50% 45%, transparent 45%, rgba(120,110,95,0.10) 100%)",
  },
};

export default function PageBackdrop({ theme = "dark", accent = "#FF6B1A" }) {
  /* Why both palettes are rendered instead of one that changes:
     `background-image` is NOT an animatable CSS property, so a gradient
     cannot be transitioned — `transition: background` on a gradient does
     nothing and the theme snaps. `opacity` IS animatable, so the dark
     palette sits underneath at full opacity and the light one cross-fades
     over it. That is what makes the toggle move at the same speed as the
     cards and text, instead of the backdrop jumping ahead of them. */
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <style>{`
        /* Very slow drift so the light never sits perfectly still, but never
           draws attention to itself either. */
        @keyframes bdDrift1 {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          50%     { transform: translate3d(6vw, 4vh, 0) scale(1.12); }
        }
        @keyframes bdDrift2 {
          0%,100% { transform: translate3d(0,0,0) scale(1.06); }
          50%     { transform: translate3d(-7vw, -5vh, 0) scale(1); }
        }
        @keyframes bdDrift3 {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          50%     { transform: translate3d(4vw, -6vh, 0) scale(1.15); }
        }
        /* No filter: blur() and no will-change here. Three big blurred,
           animated layers over the fixed star canvas were forcing constant
           re-rasterization, and the compositor was leaving stale tiles —
           which showed up as white/orange star trails smeared down the page.
           The gradients already feather to transparent, so the blur was only
           costing us artifacts. */
        .bd-orb { position: absolute; border-radius: 50%; }
        .bd-orb-1 { animation: bdDrift1 54s ease-in-out infinite; }
        .bd-orb-2 { animation: bdDrift2 67s ease-in-out infinite; }
        .bd-orb-3 { animation: bdDrift3 61s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .bd-orb-1, .bd-orb-2, .bd-orb-3 { animation: none !important; }
        }
      `}</style>

      {/* Dark palette sits underneath at full opacity… */}
      <Palette p={PALETTES.dark} accent={accent} opacity={1} />

      {/* …and the light one cross-fades over it. */}
      <Palette p={PALETTES.light} accent={accent} opacity={theme === "dark" ? 0 : 1} />

      {/* The flock is one shared canvas that tweens its own colours, rather
          than two canvases — see StarFlock. */}
      <StarFlock accent={accent} theme={theme} density={1.15} />
    </div>
  );
}

/** One theme's full stack of decorative layers. */
function Palette({ p, accent, opacity }) {
  const layer = { position: "absolute", inset: 0, pointerEvents: "none" };

  return (
    <div
      style={{
        ...layer,
        background: p.base,
        opacity,
        transition: "opacity 0.4s ease",
      }}
    >
      {/* Aurora: three wide pools of light, heavily feathered and drifting */}
      <div
        className="bd-orb bd-orb-1"
        style={{
          top: "-18vh", left: "-10vw", width: "62vw", height: "62vw",
          background: `radial-gradient(circle, ${accent}${p.orb1} 0%, transparent 66%)`,
        }}
      />
      <div
        className="bd-orb bd-orb-2"
        style={{
          top: "22vh", right: "-16vw", width: "56vw", height: "56vw",
          background: `radial-gradient(circle, ${p.cool}${p.orb2} 0%, transparent 68%)`,
        }}
      />
      <div
        className="bd-orb bd-orb-3"
        style={{
          bottom: "-24vh", left: "18vw", width: "58vw", height: "58vw",
          background: `radial-gradient(circle, ${accent}${p.orb3} 0%, transparent 68%)`,
        }}
      />

      {/* Dot grid, faded at the edges so it never reads as tiling */}
      <div
        style={{
          ...layer,
          backgroundImage: `radial-gradient(${p.dot} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(125% 95% at 50% 40%, #000 0%, rgba(0,0,0,0.5) 52%, transparent 88%)",
          WebkitMaskImage:
            "radial-gradient(125% 95% at 50% 40%, #000 0%, rgba(0,0,0,0.5) 52%, transparent 88%)",
        }}
      />

      {/* Vignette: settles the corners so content always has contrast */}
      <div style={{ ...layer, background: p.vignette }} />
    </div>
  );
}
