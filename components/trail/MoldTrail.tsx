"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * The mold that grows down the page as you scroll.
 *
 * A spine runs from [data-trail-start] through every [data-trail-node]. Its tip
 * sits ~75% down the viewport. Along the way it sprouts side branches that grow
 * into dead ends and then retract, like Physarum pruning a maze. When the tip
 * reaches a node, the node swells and its [data-trail-section] is revealed.
 * Scrolling back up runs everything in reverse.
 */

type Pt = { x: number; y: number };
type Branch = { d: string; len: number; at: number; end: Pt; r: number };
type Node = { p: Pt; at: number; section: Element | null };
type Geometry = { w: number; h: number; spine: string; branches: Branch[]; nodes: Node[]; mobile: boolean; measured: boolean };

const TIP = 0.75;
const MOBILE_X = 7; // gutter between the screen edge and the 16px content padding

export function MoldTrail() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGCircleElement>(null);
  const branchRefs = useRef<(SVGPathElement | null)[]>([]);
  const bulbRefs = useRef<(SVGCircleElement | null)[]>([]);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const lut = useRef<{ total: number; ys: Float32Array; step: number }>({ total: 0, ys: new Float32Array(0), step: 8 });

  // 1. Build geometry from the DOM.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;

    const build = () => {
      const box = root.getBoundingClientRect();
      const top = box.top + window.scrollY;
      const mobile = box.width < 768;
      const rel = (el: Element): Pt => {
        const r = el.getBoundingClientRect();
        return { x: r.left - box.left + r.width / 2, y: r.top + window.scrollY - top + r.height / 2 };
      };
      const start = document.querySelector("[data-trail-start]");
      const nodeEls = [...document.querySelectorAll("[data-trail-node]")];
      document.documentElement.classList.toggle("no-trail", !start || nodeEls.length === 0);
      if (!start || nodeEls.length === 0) {
        setGeo(null);
        return;
      }
      const pts = [rel(start), ...nodeEls.map(rel)].map((p) => (mobile ? { ...p, x: MOBILE_X } : p));

      // Spine: S-curves between consecutive points with a sideways wobble mid-way.
      let d = `M${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const dy = b.y - a.y;
        const wob = mobile ? 0 : (i % 2 ? 1 : -1) * Math.min(36, Math.max(12, a.x - 24));
        const m = { x: (a.x + b.x) / 2 + wob, y: a.y + dy / 2 };
        d += ` C${a.x} ${a.y + dy * 0.22} ${m.x} ${m.y - dy * 0.2} ${m.x} ${m.y}`;
        d += ` S${b.x} ${b.y - dy * 0.22} ${b.x} ${b.y}`;
      }
      setGeo({
        w: box.width,
        h: box.height,
        spine: d,
        branches: [],
        nodes: nodeEls.map((el, i) => ({ p: pts[i + 1], at: 0, section: el.closest("[data-trail-section]") })),
        mobile,
        measured: false,
      });
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    };
    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(root);
    window.addEventListener("resize", schedule);
    // Fonts/images can shift layout after first paint.
    const t = setTimeout(schedule, 600);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      clearTimeout(t);
    };
  }, [pathname]);

  // 2. Once the spine is in the DOM, measure it: node positions along it, branches, y lookup.
  useEffect(() => {
    const spine = spineRef.current;
    if (!geo || !spine || geo.measured) return;
    const total = spine.getTotalLength();
    const step = 6;
    const ys = new Float32Array(Math.ceil(total / step) + 1);
    for (let i = 0; i < ys.length; i++) ys[i] = spine.getPointAtLength(Math.min(total, i * step)).y;
    lut.current = { total, ys, step };
    const lenAtY = (y: number) => {
      let lo = 0;
      let hi = ys.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] < y) lo = mid + 1;
        else hi = mid;
      }
      return Math.min(total, lo * step);
    };
    const nodes = geo.nodes.map((n) => ({ ...n, at: lenAtY(n.p.y - 1) }));

    // Dead-end branches every ~260px of spine, alternating sides, kept inside the page.
    const branches: Branch[] = [];
    if (!geo.mobile) {
      let seed = 7;
      const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let at = 220, i = 0; at < total - 120; at += 200 + rand() * 140, i++) {
        const o = spine.getPointAtLength(at);
        const side = i % 2 ? 1 : -1;
        const room = side < 0 ? o.x - 10 : geo.w - o.x - 10;
        const len = Math.min(room, 70 + rand() * 150);
        if (len < 30) continue;
        const ex = o.x + side * len;
        const ey = o.y + (rand() - 0.3) * 90;
        const c1 = { x: o.x + side * len * 0.35, y: o.y + (rand() - 0.5) * 50 };
        const c2 = { x: o.x + side * len * 0.7, y: ey + (rand() - 0.5) * 60 };
        const bd = `M${o.x} ${o.y} C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${ex} ${ey}`;
        branches.push({ d: bd, len: 0, at, end: { x: ex, y: ey }, r: 3 + rand() * 4 });
      }
    }
    setGeo({ ...geo, nodes, branches, measured: true });
  }, [geo]);

  // 3. Scroll drives growth.
  useEffect(() => {
    if (!geo?.measured) return;
    const root = rootRef.current;
    const spine = spineRef.current;
    const glow = glowRef.current;
    if (!root || !spine || !glow) return;
    const { total, ys, step } = lut.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    branchRefs.current.forEach((p, i) => {
      if (p) geo.branches[i].len = p.getTotalLength();
    });
    for (const p of [spine, glow]) p.style.strokeDasharray = `${total} ${total}`;

    const lenAtY = (y: number) => {
      if (y <= ys[0]) return 0;
      let lo = 0;
      let hi = ys.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] < y) lo = mid + 1;
        else hi = mid;
      }
      return Math.min(total, lo * step);
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const top = root.getBoundingClientRect().top + window.scrollY;
      const tipY = window.scrollY + window.innerHeight * TIP - top;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      const drawn = reduce || atBottom ? total : lenAtY(tipY);

      spine.style.strokeDashoffset = String(total - drawn);
      glow.style.strokeDashoffset = String(total - drawn);
      const tip = tipRef.current;
      if (tip) {
        const p = spine.getPointAtLength(drawn);
        tip.setAttribute("cx", String(p.x));
        tip.setAttribute("cy", String(p.y));
        tip.style.opacity = drawn > 0 && drawn < total ? "1" : "0";
      }

      geo.branches.forEach((b, i) => {
        const el = branchRefs.current[i];
        const bulb = bulbRefs.current[i];
        if (!el || !bulb) return;
        const rel = drawn - b.at;
        const grow = Math.max(0, Math.min(1, rel / (b.len * 1.1)));
        const shrink = Math.max(0, Math.min(1, (rel - b.len * 1.1 - 160) / (b.len * 1.3)));
        const f = reduce ? 0 : grow - shrink * grow;
        el.style.strokeDasharray = `${b.len} ${b.len}`;
        el.style.strokeDashoffset = String(b.len * (1 - f));
        bulb.setAttribute("r", String(grow >= 1 ? b.r * (1 - shrink) : 0));
      });

      geo.nodes.forEach((n, i) => {
        const reached = drawn >= n.at - 2;
        const c = nodeRefs.current[i];
        if (c) c.setAttribute("r", reached ? (geo.mobile ? "4.5" : "7") : "0");
        n.section?.setAttribute("data-reached", String(reached));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [geo]);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {geo && (
        <svg width={geo.w} height={geo.h} className="absolute inset-0">
          <path ref={glowRef} d={geo.spine} fill="none" stroke="var(--mold-soft)" strokeWidth={geo.mobile ? 7 : 10} strokeLinecap="round" />
          <path ref={spineRef} d={geo.spine} fill="none" stroke="var(--mold)" strokeWidth={geo.mobile ? 2.5 : 3.5} strokeLinecap="round" />
          {geo.branches.map((b, i) => (
            <g key={`${b.at}-${i}`}>
              <path
                ref={(el) => {
                  branchRefs.current[i] = el;
                }}
                d={b.d}
                fill="none"
                stroke="var(--mold)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="0 99999"
              />
              <circle
                ref={(el) => {
                  bulbRefs.current[i] = el;
                }}
                cx={b.end.x}
                cy={b.end.y}
                r="0"
                fill="var(--mold)"
                style={{ transition: "r 0.3s ease" }}
              />
            </g>
          ))}
          {geo.nodes.map((n, i) => (
            <circle
              key={i}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              cx={n.p.x}
              cy={n.p.y}
              r="0"
              fill="var(--mold)"
              style={{ transition: "r 0.45s cubic-bezier(0.3,1.6,0.5,1)" }}
            />
          ))}
          <circle ref={tipRef} r={geo.mobile ? 4 : 5.5} fill="var(--mold)" opacity="0" />
        </svg>
      )}
    </div>
  );
}
