"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GrowingMark } from "@/components/brand/GrowingMark";
import { WORD_PATH } from "@/components/brand/logo-paths";
import { CELL, INTRO_KEY, desktopLayout, mobileLayout, type IntroLayout, type LabelPos } from "@/lib/intro-route";
import { services } from "@/lib/services";

/**
 * Opening sequence (homepage, once per session): the mark grows in the centre
 * of a faint maze, a single line leaves it and visits every service, reaches
 * the exit where the wordmark writes itself in, and the site is revealed
 * through the line's head. Skippable; skipped entirely for reduced motion
 * (see the inline script in app/layout.tsx).
 */

const LINE_START = 1.0; // s, after the mark has started growing
const TRAVEL = 5.4; // s spent moving
const DWELL = 0.15; // s pause at each service
const WRITE = 0.6;
const HOLD = 0.35;
const ZOOM = 0.9;
const WORD_BOX = { x: 395.8, y: 578.1, w: 804, h: 74.8 };

const N = 1, E = 2, S = 4, W = 8;
const DIRS = [
  { bit: N, dx: 0, dy: -1, opp: S },
  { bit: E, dx: 1, dy: 0, opp: W },
  { bit: S, dx: 0, dy: 1, opp: N },
  { bit: W, dx: -1, dy: 0, opp: E },
];

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const px = (c: number) => c * CELL + CELL / 2;
const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

type Stop = { x: number; y: number; at: number; label: string; pos: LabelPos };

function buildGeometry(L: IntroLayout) {
  // Route polyline in viewBox units.
  const pts: { x: number; y: number }[] = [];
  const stops: Omit<Stop, "at">[] = [];
  for (const step of L.route) {
    const [c, r] = Array.isArray(step) ? step : step.at;
    pts.push({ x: px(c), y: px(r) });
    if (!Array.isArray(step)) {
      const s = services.find((sv) => sv.slug === step.service)!;
      stops.push({ x: px(c), y: px(r), label: L.short ? s.shortName : s.name, pos: step.label });
    }
  }
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const total = cum[cum.length - 1];
  const withAt: Stop[] = stops.map((s) => ({ ...s, at: cum[pts.findIndex((p) => p.x === s.x && p.y === s.y)] }));
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join("");

  // Maze: a perfect maze grown outward from the route, so the route is its corridor.
  const X = 10; // extra cells around the viewBox to cover letterboxing
  const cols = L.cols + 2 * X;
  const rows = L.rows + 2 * X;
  const idx = (c: number, r: number) => (r + X) * cols + (c + X);
  const open = new Uint8Array(cols * rows);
  const seen = new Uint8Array(cols * rows);
  const routeCells: number[] = [];
  const ints = L.route.map((s) => (Array.isArray(s) ? s : s.at)).filter(([c, r]) => Number.isInteger(c) && Number.isInteger(r));
  for (let i = 0; i < ints.length; i++) {
    const [c, r] = ints[i];
    if (i === 0) {
      routeCells.push(idx(c, r));
      continue;
    }
    const [pc, pr] = ints[i - 1];
    const dc = Math.sign(c - pc);
    const dr = Math.sign(r - pr);
    let cc = pc;
    let cr = pr;
    while (cc !== c || cr !== r) {
      const dir = DIRS.find((dd) => dd.dx === dc && dd.dy === dr)!;
      open[idx(cc, cr)] |= dir.bit;
      cc += dc;
      cr += dr;
      open[idx(cc, cr)] |= dir.opp;
      routeCells.push(idx(cc, cr));
    }
  }
  for (const c of routeCells) seen[c] = 1;
  const rand = rng(11);
  for (const root of routeCells) {
    const stack = [root];
    while (stack.length) {
      const c = stack[stack.length - 1];
      const x = c % cols;
      const y = (c / cols) | 0;
      const options = DIRS.filter((dd) => {
        const nx = x + dd.dx;
        const ny = y + dd.dy;
        return nx >= 0 && ny >= 0 && nx < cols && ny < rows && !seen[ny * cols + nx];
      });
      if (!options.length) {
        stack.pop();
        continue;
      }
      const dd = options[Math.floor(rand() * options.length)];
      const nc = (y + dd.dy) * cols + x + dd.dx;
      open[c] |= dd.bit;
      open[nc] |= dd.opp;
      seen[nc] = 1;
      stack.push(nc);
    }
  }

  // Walls, leaving clear space around the mark and the wordmark.
  const wordW = (L.word.h / WORD_BOX.h) * WORD_BOX.w;
  const clear = (x: number, y: number) =>
    Math.hypot(x - L.mark.cx, y - L.mark.cy) < L.mark.size * 0.62 ||
    (x > L.word.x - 20 && x < L.word.x + wordW + 20 && Math.abs(y - L.word.cy) < L.word.h);
  let walls = "";
  for (let r = -X; r < L.rows + X; r++)
    for (let c = -X; c < L.cols + X; c++) {
      const o = open[idx(c, r)];
      const x = c * CELL;
      const y = r * CELL;
      if (!(o & N) && !clear(x + CELL / 2, y)) walls += `M${x} ${y}h${CELL}`;
      if (!(o & W) && !clear(x, y + CELL / 2)) walls += `M${x} ${y}v${CELL}`;
    }

  return { pts, cum, total, stops: withAt, d, walls, wordW };
}

function labelProps(s: Stop, fs: number) {
  const g = fs * 0.9;
  switch (s.pos) {
    case "above":
      return { x: s.x, y: s.y - g, textAnchor: "middle" as const };
    case "below":
      return { x: s.x, y: s.y + g + fs * 0.75, textAnchor: "middle" as const };
    case "right":
      return { x: s.x + g, y: s.y + fs * 0.35, textAnchor: "start" as const };
    case "left":
      return { x: s.x - g, y: s.y + fs * 0.35, textAnchor: "end" as const };
    case "above-left":
      return { x: s.x - fs * 0.5, y: s.y - g, textAnchor: "end" as const };
  }
}

export function IntroSequence() {
  const [layout, setLayout] = useState<IntroLayout | null>(null);
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const labelRefs = useRef<(SVGTextElement | null)[]>([]);
  const wordClipRef = useRef<SVGRectElement>(null);
  const finishRef = useRef<() => void>(() => {});

  const geo = useMemo(() => (layout ? buildGeometry(layout) : null), [layout]);

  // Decide whether to play.
  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains("intro-done")) {
      setGone(true);
      return;
    }
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}
    html.style.overflow = "hidden";
    setLayout(window.innerWidth / window.innerHeight >= 1 ? desktopLayout : mobileLayout);
  }, []);

  // Run the timeline.
  useEffect(() => {
    if (!geo || !layout) return;
    const root = rootRef.current;
    const svg = svgRef.current;
    const line = lineRef.current;
    const head = headRef.current;
    if (!root || !svg || !line || !head) return;
    const html = document.documentElement;
    const { pts, cum, total, stops } = geo;

    // Time → distance along the route, pausing briefly at each service.
    const speed = total / TRAVEL;
    const marks = stops.map((s, i) => ({ at: s.at, t: LINE_START + s.at / speed + i * DWELL }));
    const travelEnd = LINE_START + TRAVEL + stops.length * DWELL;
    const distAt = (t: number) => {
      if (t <= LINE_START) return 0;
      let base = LINE_START;
      let from = 0;
      for (const m of marks) {
        if (t < m.t) return Math.min(total, from + (t - base) * speed);
        if (t < m.t + DWELL) return m.at;
        base = m.t + DWELL;
        from = m.at;
      }
      return Math.min(total, from + (t - base) * speed);
    };
    const pointAt = (dist: number) => {
      let i = 1;
      while (i < cum.length - 1 && cum[i] < dist) i++;
      const seg = cum[i] - cum[i - 1] || 1;
      const k = clamp((dist - cum[i - 1]) / seg);
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * k, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k };
    };

    line.style.strokeDasharray = `${total} ${total}`;
    let raf = 0;
    let finished = false;
    const t0 = performance.now();

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      html.classList.add("intro-done");
      html.style.overflow = "";
      setGone(true);
    };
    finishRef.current = () => {
      if (finished) return;
      root.style.transition = "opacity 0.35s ease";
      root.style.opacity = "0";
      setTimeout(finish, 350);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const t = (now - t0) / 1000;
      const dist = distAt(t);
      line.style.strokeDashoffset = String(total - dist);
      const p = pointAt(dist);
      head.setAttribute("transform", `translate(${p.x} ${p.y})`);
      head.style.opacity = t >= LINE_START ? "1" : "0";

      stops.forEach((s, i) => {
        const on = dist >= s.at - 0.5;
        nodeRefs.current[i]?.setAttribute("r", on ? String(layout.fontSize * 0.32) : "0");
        const lab = labelRefs.current[i];
        if (lab) lab.style.opacity = on ? "1" : "0";
      });

      const write = clamp((t - travelEnd) / WRITE);
      wordClipRef.current?.setAttribute("width", String(write > 0 ? geo.wordW * write + 4 : 0));

      const zoomStart = travelEnd + WRITE + HOLD;
      if (t >= zoomStart) {
        const z = clamp((t - zoomStart) / ZOOM);
        const ctm = svg.getScreenCTM();
        const sx = ctm ? ctm.a * p.x + ctm.e : innerWidth / 2;
        const sy = ctm ? ctm.d * p.y + ctm.f : innerHeight / 2;
        const far = Math.hypot(Math.max(sx, innerWidth - sx), Math.max(sy, innerHeight - sy));
        const r = far * z * z * z;
        const m = `radial-gradient(circle at ${sx}px ${sy}px, transparent ${r}px, #000 ${r + 1}px)`;
        root.style.maskImage = m;
        root.style.webkitMaskImage = m;
        if (z >= 1) finish();
      }
    };
    raf = requestAnimationFrame(frame);

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finishRef.current();
    const skip = () => finishRef.current();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
      html.style.overflow = "";
    };
  }, [geo, layout]);

  if (gone) return null;

  const fs = layout?.fontSize ?? 18;
  return (
    <div
      id="intro"
      ref={rootRef}
      className="fixed inset-0 z-[100] cursor-pointer bg-bg"
      onClick={() => finishRef.current()}
    >
      {layout && geo && (
        <svg
          ref={svgRef}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="intro-fade">
              <stop offset="0.35" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="intro-maze-mask" maskUnits="userSpaceOnUse" x={-1000} y={-1000} width={layout.width + 2000} height={layout.height + 2000}>
              <rect x={-1000} y={-1000} width={layout.width + 2000} height={layout.height + 2000} fill="url(#intro-fade)" />
            </mask>
            <clipPath id="intro-word-clip">
              <rect ref={wordClipRef} x={layout.word.x - 2} y={layout.word.cy - layout.word.h} width="0" height={layout.word.h * 2} />
            </clipPath>
          </defs>

          <path
            d={geo.walls}
            stroke="var(--fg)"
            strokeOpacity="0.13"
            strokeWidth={layout.short ? 2 : 1.2}
            strokeLinecap="square"
            fill="none"
            mask="url(#intro-maze-mask)"
            style={{ animation: "intro-fade-in 0.8s ease both" }}
          />

          <path
            ref={lineRef}
            d={geo.d}
            fill="none"
            stroke="var(--mold)"
            strokeWidth={layout.short ? 5 : 3}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="0 99999"
          />

          {geo.stops.map((s, i) => (
            <g key={s.label}>
              <circle
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                cx={s.x}
                cy={s.y}
                r="0"
                fill="var(--mold)"
                style={{ transition: "r 0.35s cubic-bezier(0.3,1.6,0.5,1)" }}
              />
              <text
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                {...labelProps(s, fs)}
                fontSize={fs}
                fontWeight={500}
                fill="var(--fg)"
                stroke="var(--bg)"
                strokeWidth={fs * 0.35}
                paintOrder="stroke"
                style={{ opacity: 0, transition: "opacity 0.35s ease", fontFamily: "var(--font-geist-sans)" }}
              >
                {s.label}
              </text>
            </g>
          ))}

          <GrowingMark
            maskId="intro-mark-grow"
            x={layout.mark.cx - layout.mark.size / 2}
            y={layout.mark.cy - layout.mark.size / 2}
            width={layout.mark.size}
            height={layout.mark.size}
            className="text-fg"
          />

          <g clipPath="url(#intro-word-clip)">
            <path
              d={WORD_PATH}
              fill="var(--fg)"
              transform={`translate(${layout.word.x} ${layout.word.cy - layout.word.h / 2}) scale(${layout.word.h / WORD_BOX.h}) translate(${-WORD_BOX.x} ${-WORD_BOX.y})`}
            />
          </g>

          <g ref={headRef} style={{ opacity: 0 }}>
            <circle r={fs * 0.9} fill="var(--mold)" opacity="0.18" />
            <circle r={fs * 0.38} fill="var(--mold)" />
          </g>
        </svg>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finishRef.current();
        }}
        className="absolute top-4 right-4 rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:text-fg md:top-6 md:right-8"
      >
        Skip intro
      </button>
    </div>
  );
}
