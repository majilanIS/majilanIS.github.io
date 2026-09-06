import { useEffect, useRef } from "react";

/**
 * StarFlock — canvas starfield whose points move as a boids flock.
 *
 * Stars are drawn in the *counter* colour of the theme: near-white on the
 * dark palette, near-ink on the light one, so the field reads on both. A
 * slice of the flock is tinted with the section accent to keep it on-brand.
 *
 * Cheap by construction: the flock is small, neighbour search is O(n²) over
 * a few dozen points, the loop is paused whenever the section is off-screen,
 * and `prefers-reduced-motion` collapses it to a single static frame.
 *
 * Props:
 *   accent  {string}  hex accent used to tint part of the flock
 *   theme   {string}  "dark" | "light"
 *   density {number}  multiplier on the auto-computed star count
 */
export default function StarFlock({ accent = "#FF6B1A", theme = "dark", density = 1 }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ boids: [], w: 0, h: 0, dpr: 1 });
  const rafRef = useRef(0);
  const visibleRef = useRef(true);

  /* `mix` is how dark the palette currently is: 1 = dark, 0 = light. The
     theme sets the target and each frame eases toward it, so the stars
     cross-fade in step with the CSS backdrop rather than snapping. Kept in
     refs so a theme change never restarts the animation loop — restarting it
     was what made the colours jump. */
  const targetMixRef = useRef(theme === "dark" ? 1 : 0);
  const mixRef = useRef(theme === "dark" ? 1 : 0);

  useEffect(() => {
    targetMixRef.current = theme === "dark" ? 1 : 0;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    /* Counter colour: light stars on the dark ground, ink stars on the light
       one — interpolated by `mix` (1 = dark, 0 = light) so the two ends
       cross-fade instead of snapping when the theme changes. */
    const INK = [26, 26, 26];
    const SNOW = [255, 255, 255];
    const accentRGB = hexToRgb(accent) ?? "255,255,255";

    const lerp = (a, b, t) => a + (b - a) * t;
    const baseAt = (m) =>
      `${Math.round(lerp(INK[0], SNOW[0], m))},` +
      `${Math.round(lerp(INK[1], SNOW[1], m))},` +
      `${Math.round(lerp(INK[2], SNOW[2], m))}`;

    /* Ink on near-white carries further than white on near-black, so the
       light end of each range is lower — matched perceptually, not
       numerically. At parity the light field read as specks of noise. */
    const linkAlphaAt = (m) => lerp(0.10, 0.16, m);
    const starAlphaAt = (m) => lerp(0.4, 0.62, m);

    /* Edge fade is done here rather than with a CSS mask. A mask over a
       fixed-position canvas is an extra compositing layer, and those were
       leaving un-repainted tiles behind — stars smearing into trails. */
    function edgeFade(x, y, w, h) {
      const nx = (x / w - 0.5) * 2;
      const ny = (y / h - 0.5) * 2;
      const d = Math.sqrt(nx * nx * 0.6 + ny * ny * 0.85);
      return clamp(1 - (d - 0.6) / 0.5, 0, 1);
    }

    /* ── Flock parameters ─────────────────────────────────────── */
    const NEIGHBOR = 92;      // radius that counts as "in the flock"
    const SEPARATE = 30;      // personal space
    const MAX_SPEED = 0.42;
    const MIN_SPEED = 0.14;
    const LINK_DIST = 84;     // draw a constellation line under this distance

    const state = stateRef.current;

    /* ── Sizing ───────────────────────────────────────────────── */
    function resize() {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      state.w = w;
      state.h = h;
      state.dpr = dpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.round(
        clamp((w * h) / 21000, 16, 64) * density
      );
      seed(target);
    }

    function seed(target) {
      const boids = state.boids;
      while (boids.length > target) boids.pop();
      while (boids.length < target) {
        const angle = Math.random() * Math.PI * 2;
        const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
        boids.push({
          x: Math.random() * state.w,
          y: Math.random() * state.h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 0.7 + Math.random() * 1.4,
          /* ~35% of the flock carries the accent colour */
          accent: Math.random() < 0.35,
          /* twinkle phase + rate, so they don't pulse in lockstep */
          phase: Math.random() * Math.PI * 2,
          rate: 0.6 + Math.random() * 0.9,
        });
      }
      /* Keep everyone inside the box after a shrink. */
      for (const b of boids) {
        b.x = clamp(b.x, 0, state.w);
        b.y = clamp(b.y, 0, state.h);
      }
    }

    /* ── One flocking step ────────────────────────────────────── */
    function step() {
      const { boids, w, h } = state;

      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        let cx = 0, cy = 0;      // cohesion — centre of mass of neighbours
        let ax = 0, ay = 0;      // alignment — average heading
        let sx = 0, sy = 0;      // separation — push away from the too-close
        let n = 0;

        for (let j = 0; j < boids.length; j++) {
          if (i === j) continue;
          const o = boids[j];
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > NEIGHBOR * NEIGHBOR || d2 === 0) continue;

          n++;
          cx += o.x; cy += o.y;
          ax += o.vx; ay += o.vy;

          if (d2 < SEPARATE * SEPARATE) {
            const d = Math.sqrt(d2);
            sx -= dx / d;
            sy -= dy / d;
          }
        }

        if (n > 0) {
          b.vx += ((cx / n - b.x) * 0.00045) + ((ax / n - b.vx) * 0.035) + sx * 0.014;
          b.vy += ((cy / n - b.y) * 0.00045) + ((ay / n - b.vy) * 0.035) + sy * 0.014;
        }

        /* A whisper of drift so a settled flock never goes perfectly still. */
        b.vx += (Math.random() - 0.5) * 0.006;
        b.vy += (Math.random() - 0.5) * 0.006;

        /* Clamp speed into the band. */
        const sp = Math.hypot(b.vx, b.vy) || 1;
        const want = clamp(sp, MIN_SPEED, MAX_SPEED);
        b.vx = (b.vx / sp) * want;
        b.vy = (b.vy / sp) * want;

        b.x += b.vx;
        b.y += b.vy;

        /* Wrap at the edges — the flock drifts through, never bounces. */
        if (b.x < -6) b.x = w + 6;
        else if (b.x > w + 6) b.x = -6;
        if (b.y < -6) b.y = h + 6;
        else if (b.y > h + 6) b.y = -6;

        b.phase += 0.016 * b.rate;
      }
    }

    /* ── Draw ─────────────────────────────────────────────────── */
    function draw() {
      const { boids, w, h } = state;

      /* Ease the palette toward the current theme. 0.055/frame lands in
         roughly 0.4s at 60fps, matching the CSS cross-fade on the backdrop. */
      const target = targetMixRef.current;
      mixRef.current += (target - mixRef.current) * 0.055;
      if (Math.abs(target - mixRef.current) < 0.002) mixRef.current = target;

      const mix = mixRef.current;
      const baseRGB = baseAt(mix);
      const linkAlpha = linkAlphaAt(mix);
      const starAlpha = starAlphaAt(mix);

      /* Clear the full backing store with the transform reset, so a stale
         dpr or transform can never leave part of the frame unpainted. */
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      /* Constellation lines first, so stars sit on top of them. */
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        for (let j = i + 1; j < boids.length; j++) {
          const o = boids[j];
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST * LINK_DIST) continue;
          const fade =
            (1 - Math.sqrt(d2) / LINK_DIST) * edgeFade((b.x + o.x) / 2, (b.y + o.y) / 2, w, h);
          if (fade <= 0) continue;
          ctx.strokeStyle = `rgba(${b.accent && o.accent ? accentRGB : baseRGB},${(
            linkAlpha * fade
          ).toFixed(3)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(o.x, o.y);
          ctx.stroke();
        }
      }

      for (const b of boids) {
        const fade = edgeFade(b.x, b.y, w, h);
        if (fade <= 0) continue;
        const twinkle = 0.55 + 0.45 * Math.sin(b.phase);
        const rgb = b.accent ? accentRGB : baseRGB;
        const alpha = starAlpha * twinkle * fade;

        /* Soft halo, then the core point — reads as a star, not a dot. */
        const halo = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 4.5);
        halo.addColorStop(0, `rgba(${rgb},${(alpha * 0.42).toFixed(3)})`);
        halo.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${rgb},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function frame() {
      /* Under reduced motion the flock holds still, but the palette still
         needs to cross-fade on a theme change — so keep drawing until the
         colour has settled, then idle. */
      const settled = mixRef.current === targetMixRef.current;
      if (visibleRef.current && !(reduced && settled)) {
        if (!reduced) step();
        draw();
      }
      rafRef.current = requestAnimationFrame(frame);
    }

    resize();
    rafRef.current = requestAnimationFrame(frame);

    /* Stop burning frames while the section is scrolled out of view. */
    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw();   // the idle loop won't repaint on its own
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
      ro.disconnect();
    };
    /* `theme` is deliberately NOT a dependency: it is read through a ref and
       eased inside draw(). Listing it here would tear down and rebuild the
       loop on every toggle, which is exactly what made the colours snap. */
  }, [accent, density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex).trim());
  if (!m) return null;
  return `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}`;
}
