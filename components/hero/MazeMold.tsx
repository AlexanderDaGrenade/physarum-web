"use client";

import { useEffect, useRef } from "react";

/**
 * Physarum solving a maze, the way it does in the lab:
 *   1. a faint maze fades in;
 *   2. the mold spreads from the start through every corridor at a steady pace;
 *   3. once it has reached all the food, it withdraws from the dead ends (tips first);
 *   4. the surviving routes thicken; it holds, fades, and a new maze begins.
 * Everything is a pure function of time, so the motion is smooth and consistent.
 */

const N = 1, E = 2, S = 4, W = 8;
const DIRS = [
  { bit: N, dx: 0, dy: -1, opp: S },
  { bit: E, dx: 1, dy: 0, opp: W },
  { bit: S, dx: 0, dy: 1, opp: N },
  { bit: W, dx: -1, dy: 0, opp: E },
];

// Food positions as fractions of the canvas; the last one sits where the scroll trail begins.
const FOOD: [number, number][] = [
  [0.07, 0.4],
  [0.93, 0.32],
  [0.1, 0.9],
  [0.9, 0.88],
  [0.5, 0.985],
];

const FADE_IN = 0.8;
const EXPLORE = 20; // cells per second
const PRUNE = 16; // dead-end levels per second
const THICKEN = 0.9;
const HOLD = 3.5;
const FADE_OUT = 1.2;

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Maze = {
  cols: number;
  rows: number;
  cell: number;
  ox: number;
  oy: number;
  open: Uint8Array;
  parent: Int32Array;
  depth: Int32Array;
  keep: Uint8Array;
  height: Int32Array; // for pruned cells: levels above the dead-end tip (tip = 0)
  foods: number[];
  start: number;
  exploreEnd: number;
  pruneLevels: number;
};

function buildMaze(w: number, h: number, cell: number, startXY: [number, number], seed: number): Maze {
  const rand = rng(seed);
  const cols = Math.max(4, Math.floor(w / cell));
  const rows = Math.max(4, Math.floor(h / cell));
  const ox = (w - cols * cell) / 2;
  const oy = (h - rows * cell) / 2;
  const n = cols * rows;
  const open = new Uint8Array(n);

  // Perfect maze by iterative depth-first search…
  const seen = new Uint8Array(n);
  const stack = [Math.floor(rand() * n)];
  seen[stack[0]] = 1;
  while (stack.length) {
    const c = stack[stack.length - 1];
    const x = c % cols;
    const y = (c / cols) | 0;
    const options = DIRS.filter((d) => {
      const nx = x + d.dx;
      const ny = y + d.dy;
      return nx >= 0 && ny >= 0 && nx < cols && ny < rows && !seen[ny * cols + nx];
    });
    if (!options.length) {
      stack.pop();
      continue;
    }
    const d = options[Math.floor(rand() * options.length)];
    const nc = (y + d.dy) * cols + x + d.dx;
    open[c] |= d.bit;
    open[nc] |= d.opp;
    seen[nc] = 1;
    stack.push(nc);
  }
  // …plus a few extra openings so there are loops and competing routes.
  for (let i = 0; i < n * 0.08; i++) {
    const c = Math.floor(rand() * n);
    const d = DIRS[Math.floor(rand() * 4)];
    const x = (c % cols) + d.dx;
    const y = ((c / cols) | 0) + d.dy;
    if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
    open[c] |= d.bit;
    open[y * cols + x] |= d.opp;
  }

  const cellAt = (fx: number, fy: number) => {
    const x = Math.min(cols - 1, Math.max(0, Math.floor((fx - ox) / cell)));
    const y = Math.min(rows - 1, Math.max(0, Math.floor((fy - oy) / cell)));
    return y * cols + x;
  };
  const start = cellAt(startXY[0], startXY[1]);

  // Breadth-first spread from the start.
  const parent = new Int32Array(n).fill(-1);
  const depth = new Int32Array(n).fill(-1);
  depth[start] = 0;
  const queue = [start];
  for (let q = 0; q < queue.length; q++) {
    const c = queue[q];
    const x = c % cols;
    const y = (c / cols) | 0;
    for (const d of DIRS) {
      if (!(open[c] & d.bit)) continue;
      const nc = (y + d.dy) * cols + x + d.dx;
      if (depth[nc] >= 0) continue;
      depth[nc] = depth[c] + 1;
      parent[nc] = c;
      queue.push(nc);
    }
  }

  const foods = [...new Set(FOOD.map(([fx, fy]) => cellAt(fx * w, fy * h)))].filter((f) => f !== start);
  const exploreEnd = Math.max(...foods.map((f) => depth[f])) + 2;

  // Routes to food survive.
  const keep = new Uint8Array(n);
  for (const f of foods) for (let c = f; c >= 0; c = parent[c]) keep[c] = 1;

  // Everything else that was explored retracts from its tips inward.
  const height = new Int32Array(n).fill(-1);
  const order = queue.filter((c) => depth[c] <= exploreEnd).sort((a, b) => depth[b] - depth[a]);
  let pruneLevels = 0;
  for (const c of order) {
    if (keep[c]) continue;
    if (height[c] < 0) height[c] = 0;
    const p = parent[c];
    if (p >= 0 && !keep[p]) height[p] = Math.max(height[p], height[c] + 1);
    pruneLevels = Math.max(pruneLevels, height[c] + 1);
  }

  return { cols, rows, cell, ox, oy, open, parent, depth, keep, height, foods, start, exploreEnd, pruneLevels };
}

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function MazeMold({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let maze: Maze;
    let walls: HTMLCanvasElement;
    let seed = 7;
    let t0 = performance.now();
    let colors = { mold: "#f5c518", fg: "#f5f5f5" };

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      colors = { mold: cs.getPropertyValue("--mold").trim() || colors.mold, fg: cs.getPropertyValue("--fg").trim() || colors.fg };
    };

    const startPoint = (): [number, number] => {
      const anchor = document.querySelector("[data-maze-start]");
      const box = canvas.getBoundingClientRect();
      if (!anchor) return [w / 2, h * 0.15];
      const r = anchor.getBoundingClientRect();
      return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top];
    };

    const newMaze = () => {
      const cell = w < 640 ? 30 : 42;
      maze = buildMaze(w, h, cell, startPoint(), seed++);
      // Walls are static per maze: draw them once.
      walls = document.createElement("canvas");
      walls.width = canvas.width;
      walls.height = canvas.height;
      const wc = walls.getContext("2d")!;
      wc.scale(dpr, dpr);
      wc.strokeStyle = colors.fg;
      wc.globalAlpha = 0.09;
      wc.lineWidth = 1;
      wc.lineCap = "square";
      wc.beginPath();
      const { cols, rows, ox, oy, open } = maze;
      for (let c = 0; c < cols * rows; c++) {
        const x = ox + (c % cols) * cell;
        const y = oy + ((c / cols) | 0) * cell;
        if (!(open[c] & N)) {
          wc.moveTo(x, y);
          wc.lineTo(x + cell, y);
        }
        if (!(open[c] & W)) {
          wc.moveTo(x, y);
          wc.lineTo(x, y + cell);
        }
        if (c % cols === cols - 1 && !(open[c] & E)) {
          wc.moveTo(x + cell, y);
          wc.lineTo(x + cell, y + cell);
        }
        if (((c / cols) | 0) === rows - 1 && !(open[c] & S)) {
          wc.moveTo(x, y + cell);
          wc.lineTo(x + cell, y + cell);
        }
      }
      wc.stroke();
    };

    const setup = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      readColors();
      newMaze();
      t0 = performance.now();
    };

    const center = (c: number): [number, number] => [
      maze.ox + ((c % maze.cols) + 0.5) * maze.cell,
      maze.oy + (((c / maze.cols) | 0) + 0.5) * maze.cell,
    ];

    const timeline = () => {
      const exploreDur = maze.exploreEnd / EXPLORE;
      const pruneStart = FADE_IN + exploreDur + 0.3;
      const pruneDur = maze.pruneLevels / PRUNE;
      const thickenStart = pruneStart + pruneDur;
      const fadeStart = thickenStart + THICKEN + HOLD;
      return { pruneStart, thickenStart, fadeStart, end: fadeStart + FADE_OUT };
    };

    const draw = (t: number) => {
      const tl = timeline();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const fadeOut = 1 - clamp((t - tl.fadeStart) / FADE_OUT);
      ctx.globalAlpha = clamp(t / FADE_IN) * fadeOut;
      ctx.drawImage(walls, 0, 0);
      ctx.scale(dpr, dpr);

      const front = Math.min(maze.exploreEnd, Math.max(0, (t - FADE_IN) * EXPLORE));
      const pruneFront = Math.max(0, (t - tl.pruneStart) * PRUNE);
      const thick = clamp((t - tl.thickenStart) / THICKEN);
      const { parent, depth, keep, height } = maze;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = colors.mold;

      // Exploring / retracting network.
      ctx.globalAlpha = 0.38 * fadeOut;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let c = 0; c < depth.length; c++) {
        const d = depth[c];
        if (d <= 0 || d > maze.exploreEnd || keep[c]) continue;
        const grown = clamp(front - (d - 1));
        const left = grown * (1 - clamp(pruneFront - height[c]));
        if (left <= 0) continue;
        const [px, py] = center(parent[c]);
        const [cx, cy] = center(c);
        ctx.moveTo(px, py);
        ctx.lineTo(px + (cx - px) * left, py + (cy - py) * left);
      }
      ctx.stroke();

      // Surviving routes: same growth, then they thicken.
      ctx.globalAlpha = (0.6 + 0.4 * thick) * fadeOut;
      ctx.lineWidth = 1.5 + 2 * thick;
      ctx.beginPath();
      for (let c = 0; c < depth.length; c++) {
        const d = depth[c];
        if (d <= 0 || !keep[c]) continue;
        const grown = clamp(front - (d - 1));
        if (grown <= 0) continue;
        const [px, py] = center(parent[c]);
        const [cx, cy] = center(c);
        ctx.moveTo(px, py);
        ctx.lineTo(px + (cx - px) * grown, py + (cy - py) * grown);
      }
      ctx.stroke();

      // Food sources swell when reached.
      ctx.fillStyle = colors.mold;
      ctx.globalAlpha = fadeOut;
      for (const f of maze.foods) {
        const reached = clamp((front - depth[f]) * 2);
        const [x, y] = center(f);
        ctx.beginPath();
        ctx.arc(x, y, 2.5 + 3.5 * reached + 1.5 * thick, 0, Math.PI * 2);
        ctx.globalAlpha = (0.35 + 0.65 * reached) * fadeOut;
        ctx.fill();
      }
      return t >= tl.end;
    };

    setup();
    if (reduceMotion) {
      draw(timeline().thickenStart + THICKEN);
      canvas.style.opacity = "1";
      return;
    }
    canvas.style.opacity = "1";

    let raf = 0;
    let visible = true;
    let paused = 0;
    let pausedAt = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) {
        if (!pausedAt) pausedAt = now;
        return;
      }
      if (pausedAt) {
        paused += now - pausedAt;
        pausedAt = 0;
      }
      const t = (now - t0 - paused) / 1000;
      if (draw(t)) {
        readColors();
        newMaze();
        t0 = now;
        paused = 0;
      }
    };
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      readColors();
      newMaze();
      t0 = performance.now();
      paused = 0;
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let lastWidth = window.innerWidth;
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(timer);
      timer = setTimeout(() => {
        setup();
        paused = 0;
      }, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      themeObserver.disconnect();
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ opacity: 0, transition: "opacity 0.8s ease" }}
    />
  );
}
