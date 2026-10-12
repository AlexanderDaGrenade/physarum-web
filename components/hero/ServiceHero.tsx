"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { families, serviceHref, services } from "@/lib/services";

const COPIES = 3; // the middle copy is the "real" one; the outer copies make the loop seamless
const SPEED = 38; // px per second
const familyName = (slug: string) => families.find((f) => f.slug === slug)?.name ?? "";

/**
 * "Intelligence that navigates ___" — the last word follows the service card
 * that's hovered/focused, or the one in the centre while the carousel revolves.
 * A mold tendril links the word to that card.
 */
export function ServiceHero() {
  const n = services.length;
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const wordRef = useRef<HTMLSpanElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const tendrilRef = useRef<SVGPathElement>(null);

  const [active, setActive] = useState(0);
  const [held, setHeld] = useState<number | null>(null); // card index under pointer/focus (0..3n)
  const [tendril, setTendril] = useState<{ d: string; a: [number, number]; b: [number, number] } | null>(null);

  const state = useRef({
    offset: 0,
    paused: false,
    visible: true,
    dragging: false,
    dragStartX: 0,
    dragStartOffset: 0,
    dragMoved: false,
    cardW: 280,
    gap: 16,
    reduce: false,
  });

  // Measure card size (responsive) and lay out per frame.
  const layout = useCallback(() => {
    const s = state.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return 0;
    const unit = s.cardW + s.gap;
    const setW = n * unit;
    s.offset = ((s.offset % setW) + setW) % setW;
    const shift = s.offset + setW; // start inside the middle copy
    const center = stage.clientWidth / 2;
    track.style.transform = `translate3d(${-shift}px,0,0)`;
    let centerIdx = 0;
    let best = Infinity;
    cardRefs.current.forEach((el, k) => {
      if (!el) return;
      const mid = k * unit + s.cardW / 2 - shift;
      const d = (mid - center) / unit;
      if (Math.abs(d) < best) {
        best = Math.abs(d);
        centerIdx = k;
      }
      const c = Math.max(-3, Math.min(3, d));
      el.style.transform = s.reduce
        ? ""
        : `perspective(1200px) rotateY(${c * -14}deg) scale(${1 - Math.abs(c) * 0.07})`;
      el.style.opacity = String(1 - Math.min(1, Math.abs(d) / 4) * 0.65);
    });
    return centerIdx % n;
  }, [n]);

  useLayoutEffect(() => {
    const s = state.current;
    s.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const measure = () => {
      const el = cardRefs.current[0];
      if (el) s.cardW = el.offsetWidth;
      setActive(layout());
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [layout]);

  // Revolve.
  useEffect(() => {
    const s = state.current;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!s.visible || document.hidden) return;
      if (!s.paused && !s.dragging && !s.reduce) s.offset += SPEED * dt;
      const c = layout();
      if (!s.paused) setActive((prev) => (prev === c ? prev : c));
    };
    raf = requestAnimationFrame(tick);
    const io = new IntersectionObserver(([e]) => (s.visible = e.isIntersecting));
    if (stageRef.current) io.observe(stageRef.current);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [layout]);

  const hold = (k: number) => {
    state.current.paused = true;
    setHeld(k);
    setActive(k % n);
  };
  const release = () => {
    state.current.paused = false;
    setHeld(null);
  };

  // Keyboard focus: bring the focused card to the centre.
  const focusCard = (k: number) => {
    const s = state.current;
    const stage = stageRef.current;
    if (stage) stage.scrollLeft = 0;
    const unit = s.cardW + s.gap;
    const i = k % n;
    s.offset = i * unit + s.cardW / 2 - (stage?.clientWidth ?? 0) / 2;
    layout();
    hold(k);
  };

  // Drag / swipe.
  const onPointerDown = (e: React.PointerEvent) => {
    const s = state.current;
    s.dragging = true;
    s.dragMoved = false;
    s.dragStartX = e.clientX;
    s.dragStartOffset = s.offset;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.dragStartX;
    if (Math.abs(dx) > 6 && !s.dragMoved) {
      s.dragMoved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (s.dragMoved) s.offset = s.dragStartOffset - dx;
  };
  const onPointerUp = () => {
    state.current.dragging = false;
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (state.current.dragMoved) {
      e.preventDefault();
      e.stopPropagation();
      state.current.dragMoved = false;
    }
  };

  // Tendril from the headline word to the active card (or the centre slot while revolving).
  useEffect(() => {
    const draw = () => {
      const hero = heroRef.current;
      const word = wordRef.current;
      const stage = stageRef.current;
      if (!hero || !word || !stage) return;
      const h = hero.getBoundingClientRect();
      const w = word.getBoundingClientRect();
      const st = stage.getBoundingClientRect();
      const ax = w.left + w.width / 2 - h.left;
      const ay = w.bottom - h.top + 10;
      let bx = st.left + st.width / 2 - h.left;
      const by = st.top - h.top - 6;
      const card = held !== null ? cardRefs.current[held] : null;
      if (card) {
        const c = card.getBoundingClientRect();
        bx = c.left + c.width / 2 - h.left;
      }
      const my = (ay + by) / 2;
      setTendril({ d: `M${ax} ${ay} C${ax} ${my} ${bx} ${my} ${bx} ${by}`, a: [ax, ay], b: [bx, by] });
    };
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [held, active]);

  // Re-run the draw animation whenever the path changes.
  useEffect(() => {
    const p = tendrilRef.current;
    if (!p || state.current.reduce) return;
    const len = p.getTotalLength();
    p.style.setProperty("--len", String(len));
    p.style.strokeDasharray = String(len);
    p.style.animation = "none";
    void p.getBoundingClientRect();
    p.style.animation = "draw 0.6s cubic-bezier(0.3,0.7,0.2,1) both";
  }, [tendril]);

  const word = services[active].headlineWord;

  return (
    <div ref={heroRef} className="relative">
      <h1 className="mx-auto max-w-5xl px-4 text-center [text-shadow:0_0_18px_var(--bg),0_0_36px_var(--bg)] text-4xl leading-[1.05] font-semibold tracking-tight md:text-7xl">
        <span className="block">Intelligence that navigates</span>
        <span ref={wordRef} className="inline-block min-h-[1.1em]" aria-hidden="true">
          <span key={word} className="word-in inline-block">
            {word}
          </span>
        </span>
        <span className="sr-only">AI, data, software and growth</span>
      </h1>

      {tendril && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <path ref={tendrilRef} d={tendril.d} fill="none" stroke="var(--mold)" strokeWidth="3" strokeLinecap="round" />
          <circle cx={tendril.a[0]} cy={tendril.a[1]} r="4" fill="var(--mold)" />
          <circle cx={tendril.b[0]} cy={tendril.b[1]} r="6" fill="var(--mold)" className="node-grow" key={`${tendril.b[0]}`} />
        </svg>
      )}

      <div
        ref={stageRef}
        className="relative mt-24 touch-pan-y overflow-x-clip select-none md:mt-28"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        style={{ maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)" }}
      >
        <div ref={trackRef} className="flex w-max gap-4 py-6 will-change-transform" role="list">
          {Array.from({ length: COPIES * n }, (_, k) => {
            const s = services[k % n];
            const real = Math.floor(k / n) === 1;
            const isActive = held === k || (held === null && active === k % n && real);
            return (
              <Link
                key={k}
                ref={(el) => {
                  cardRefs.current[k] = el;
                }}
                href={serviceHref(s)}
                role="listitem"
                tabIndex={real ? 0 : -1}
                aria-hidden={real ? undefined : true}
                draggable={false}
                onMouseEnter={() => hold(k)}
                onMouseLeave={release}
                onFocus={() => focusCard(k)}
                onBlur={release}
                className={`flex h-56 w-60 shrink-0 flex-col justify-between rounded-2xl border bg-card p-5 transition-colors duration-300 md:w-72 ${
                  isActive ? "border-mold" : "border-line"
                }`}
              >
                <span className="font-mono text-[11px] tracking-widest text-muted uppercase">{familyName(s.family)}</span>
                <span>
                  <span className="block text-xl font-semibold tracking-tight">{s.name}</span>
                  <span className="mt-2 line-clamp-3 block text-sm text-muted">{s.summary}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
