import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { contact, pick, type Lang } from "../content/site";

const VW = 1000;
const VH = 800;
const HX = 500;
const HY = 592;
const FIRE_AT = 28;
const CORD = [-14, -9.5, -5.5, -2, 2, 5.5, 9.5, 14] as const;

type Pt = { x: number; y: number };

type Silk = {
  d: string;
  kind: "spoke" | "hair" | "ring" | "frame";
  end?: Pt;
  angle?: number;
  points?: Pt[];
  drop?: number;
};

function spokeEnd(angle: number, compact: boolean, i: number) {
  const rx = compact ? 430 : 520;
  const ry = compact ? 310 : 355;
  const bulge = 1 + Math.abs(Math.sin(angle)) * 0.18;
  const jitter = 0.93 + Math.sin(i * 1.9) * 0.07;
  return {
    x: HX + Math.sin(angle) * rx * bulge * jitter,
    y: HY - Math.cos(angle) * ry * jitter,
    angle,
  };
}

function sagTo(a: { x: number; y: number }, b: { x: number; y: number }, drop: number, sway: number) {
  const mx = (a.x + b.x) * 0.5 + sway;
  const my = (a.y + b.y) * 0.5 + drop;
  return ` Q ${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

function buildWeb(compact: boolean): Silk[] {
  const spokes = compact ? 15 : 19;
  const rings = compact ? 9 : 13;
  const half = compact ? 1.52 : 1.68;
  const silk: Silk[] = [];
  const ends: { x: number; y: number; angle: number }[] = [];

  for (let i = 0; i < spokes; i += 1) {
    const t = i / Math.max(spokes - 1, 1);
    const angle = -half + t * half * 2 + Math.sin(i * 2.6) * 0.03;
    const end = spokeEnd(angle, compact, i);
    ends.push(end);
    silk.push({
      d: `M ${HX} ${HY} L ${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
      kind: "spoke",
      end: { x: end.x, y: end.y },
      angle,
    });
    if (i % 2 === 1) {
      const hair = spokeEnd(angle + 0.028, compact, i + 11);
      silk.push({
        d: `M ${HX} ${HY} L ${hair.x.toFixed(1)} ${hair.y.toFixed(1)}`,
        kind: "hair",
        end: { x: hair.x, y: hair.y },
        angle: angle + 0.028,
      });
    }
  }

  const frame = ends.map((end, i) => ({
    x: end.x + Math.sin(end.angle) * (8 + (i % 3) * 3),
    y: end.y - Math.cos(end.angle) * (6 + (i % 2) * 4),
  }));
  let frameD = `M ${frame[0].x.toFixed(1)} ${frame[0].y.toFixed(1)}`;
  for (let i = 1; i < frame.length; i += 1) {
    const gap = Math.hypot(frame[i].x - frame[i - 1].x, frame[i].y - frame[i - 1].y);
    frameD += sagTo(frame[i - 1], frame[i], 10 + gap * 0.06, Math.sin(i * 1.3) * 6);
  }
  silk.push({ d: frameD, kind: "frame", points: frame, drop: 10 });

  for (let ring = 0; ring < rings; ring += 1) {
    const u = 0.1 + (ring / (rings - 1)) ** 0.88 * 0.84;
    const skip = ring > rings - 3 ? 1 + (ring % 2) : 0;
    const pts = ends.slice(skip, ends.length - skip).map((end, i) => ({
      x: HX + (end.x - HX) * u + Math.sin(i * 1.7 + ring) * 3.2,
      y: HY + (end.y - HY) * u + Math.cos(i * 1.2 + ring * 0.6) * 2.4,
    }));
    if (pts.length < 3) continue;
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i += 1) {
      const gap = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      const drop = 11 + ring * 1.35 + gap * 0.085;
      d += sagTo(pts[i - 1], pts[i], drop, Math.sin(ring + i * 0.8) * 5);
    }
    silk.push({ d, kind: "ring", points: pts, drop: 11 + ring * 1.35 });
  }

  return silk;
}

function swayPoint(point: Pt, time: number, index: number, cursor: Pt | null, amp: number) {
  let x = point.x + Math.sin(time / 320 + index * 0.85) * 4.2 * amp;
  let y = point.y + Math.cos(time / 260 + index * 0.55) * 5.4 * amp;
  if (cursor) {
    const dx = point.x - cursor.x;
    const dy = point.y - cursor.y;
    const dist = Math.hypot(dx, dy) || 1;
    const fall = Math.max(0, 1 - dist / 220);
    x += (dx / dist) * fall * 16 * amp;
    y += (dy / dist) * fall * 16 * amp;
  }
  return { x, y };
}

function wavePath(strand: Silk, time: number, cursor: Pt | null, amp: number) {
  if ((strand.kind === "spoke" || strand.kind === "hair") && strand.end && strand.angle != null) {
    const end = swayPoint(strand.end, time, strand.angle * 8, cursor, amp * 0.55);
    const mid = {
      x: (HX + end.x) * 0.5 + Math.cos(strand.angle) * Math.sin(time / 240 + strand.angle * 4) * 14 * amp,
      y: (HY + end.y) * 0.5 + Math.sin(time / 200 + strand.angle * 3) * 11 * amp,
    };
    return `M ${HX} ${HY} Q ${mid.x.toFixed(1)} ${mid.y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
  }
  const pts = strand.points;
  if (!pts || pts.length < 2) return strand.d;
  const moved = pts.map((pt, i) => swayPoint(pt, time, i + (strand.drop ?? 0), cursor, amp));
  let d = `M ${moved[0].x.toFixed(1)} ${moved[0].y.toFixed(1)}`;
  for (let i = 1; i < moved.length; i += 1) {
    const gap = Math.hypot(moved[i].x - moved[i - 1].x, moved[i].y - moved[i - 1].y);
    const drop = (strand.drop ?? 10) + gap * 0.08 + Math.sin(time / 220 + i) * 7 * amp;
    d += sagTo(moved[i - 1], moved[i], drop, Math.sin(time / 300 + i) * 6 * amp);
  }
  return d;
}

function MenuMark({ id }: { id: string }) {
  if (id === "mail") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 2.8v3.2M12 18v3.2M3 12h3.2M17.8 12H21" />
        <path d="M5.6 5.6l2.2 2.2M16.2 16.2l2.2 2.2M5.6 18.4l2.2-2.2M16.2 7.8l2.2-2.2" />
      </svg>
    );
  }
  if (id === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 13.2a6.4 6.4 0 0 1-6.2-4.6" />
        <path d="M12 13.2a6.4 6.4 0 0 0 6.2-4.6" />
        <path d="M12 13.2a9.4 9.4 0 0 1-8.8-6.2" />
        <circle cx="12" cy="14.6" r="1.5" />
      </svg>
    );
  }
  if (id === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="14" r="2.2" />
        <path d="M12 11.6V5.2M9.4 7.2 12 5l2.6 2.2" />
      </svg>
    );
  }
  if (id === "kaggle") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 17c5-1 8-5 10-10" />
        <path d="M15 7c1.6 0 3.2.6 4.4 1.8" />
        <circle cx="6.2" cy="17.2" r="1.3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 10.2c.4-2.4 2.2-4 5-4s4.6 1.6 5 4" />
      <ellipse cx="9.2" cy="12.4" rx="1.6" ry="2.1" />
      <ellipse cx="14.8" cy="12.4" rx="1.6" ry="2.1" />
    </svg>
  );
}

export function WebMenu({ lang }: { lang: Lang }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const silkRef = useRef<SVGSVGElement>(null);
  const waveOn = useRef(false);
  const cursorRef = useRef<Pt | null>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const pullRef = useRef({ x: 0, y: 0 });
  const timers = useRef<number[]>([]);
  const [stage, setStage] = useState({ w: 1000, h: 800 });
  const [anchor, setAnchor] = useState({ x: 500, y: 640 });
  const [pull, setPull] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [snap, setSnap] = useState(false);
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState(false);
  const [compact, setCompact] = useState(false);
  const [lengths, setLengths] = useState<number[]>([]);
  const [waving, setWaving] = useState(false);
  const silk = useMemo(() => buildWeb(compact), [compact]);
  const maxLen = Math.max(...lengths, 1);
  const spanX = pull.x;
  const spanY = pull.y;
  const taut = Math.hypot(spanX, spanY);

  function restPoint() {
    const root = rootRef.current?.getBoundingClientRect();
    const dock = dockRef.current?.getBoundingClientRect();
    if (!root || !dock) return { x: stage.w * 0.5, y: stage.h * 0.74 };
    return {
      x: dock.left + dock.width / 2 - root.left,
      y: dock.top + dock.height / 2 - root.top,
    };
  }

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const measure = () => {
      setStage({ w: node.clientWidth || 1000, h: node.clientHeight || 800 });
      setAnchor(restPoint());
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    setLengths(
      pathRefs.current.map((node) => {
        if (!node) return 800;
        const len = node.getTotalLength();
        return Number.isFinite(len) && len > 1 ? len : 800;
      }),
    );
  }, [silk]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !waving) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;
    let frame = 0;
    let intensity = 0;
    const tick = (time: number) => {
      intensity += ((waveOn.current ? 1 : 0) - intensity) * 0.07;
      if (intensity < 0.012 && !waveOn.current) {
        silk.forEach((strand, index) => {
          pathRefs.current[index]?.setAttribute("d", strand.d);
        });
        setWaving(false);
        return;
      }
      silk.forEach((strand, index) => {
        const node = pathRefs.current[index];
        if (!node) return;
        node.setAttribute("d", wavePath(strand, time, cursorRef.current, intensity));
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [open, silk, waving]);

  function viewPoint(event: { clientX: number; clientY: number }) {
    const svg = silkRef.current;
    if (!svg) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const screen = svg.getScreenCTM();
    if (!screen) return null;
    const local = point.matrixTransform(screen.inverse());
    return { x: local.x, y: local.y };
  }

  function onWaveMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!open) return;
    cursorRef.current = viewPoint(event);
    if (!waveOn.current) {
      waveOn.current = true;
      setWaving(true);
    }
  }

  function onWaveLeave(event: React.PointerEvent<HTMLDivElement>) {
    if (rootRef.current?.contains(event.relatedTarget as Node)) return;
    waveOn.current = false;
    cursorRef.current = null;
  }

  function clearTimers() {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }

  function later(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function close() {
    clearTimers();
    setPanel(false);
    waveOn.current = false;
    cursorRef.current = null;
    setWaving(false);
    silk.forEach((strand, index) => {
      pathRefs.current[index]?.setAttribute("d", strand.d);
    });
    later(() => setOpen(false), 220);
  }

  function fire() {
    clearTimers();
    setOpen(true);
    later(() => setPanel(true), 480);
  }

  function applyPull(next: { x: number; y: number }) {
    pullRef.current = next;
    setPull(next);
  }

  function onPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (open || panel) {
      close();
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY };
    const node = rootRef.current;
    if (node) setStage({ w: node.clientWidth || 1000, h: node.clientHeight || 800 });
    setAnchor(restPoint());
    setSnap(false);
    setDragging(true);
  }

  function onPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const start = drag.current;
    if (!start) return;
    const x = Math.max(-120, Math.min(120, event.clientX - start.x));
    const y = Math.max(-40, Math.min(130, event.clientY - start.y));
    applyPull({ x, y });
  }

  function onPointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    if (!drag.current) return;
    const dist = Math.hypot(pullRef.current.x, pullRef.current.y);
    drag.current = null;
    setDragging(false);
    setSnap(true);
    applyPull({ x: 0, y: 0 });
    later(() => setSnap(false), 280);
    if (dist >= FIRE_AT) fire();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const nx = taut > 1 ? -spanY / taut : 0;
  const ny = taut > 1 ? spanX / taut : 0;
  const ux = taut > 1 ? spanX / taut : 0;
  const uy = taut > 1 ? spanY / taut : 0;
  const stretch = Math.min(taut / 180, 1);
  const bow = 22 * (1 - stretch * 0.78);
  const coreW = 3.6 - stretch * 1.1;
  const hairW = 1.7 - stretch * 0.3;
  const rim = 34;

  return (
    <div
      ref={rootRef}
      className={`web-menu${open ? " is-open" : ""}${panel ? " is-panel" : ""}${dragging ? " is-pull" : ""}${snap ? " is-snap" : ""}${waving ? " is-wave" : ""}`}
      onPointerMove={onWaveMove}
      onPointerLeave={onWaveLeave}
    >
      <svg
        ref={silkRef}
        className="web-menu__silk"
        viewBox={`0 0 ${VW} ${VH}`}
        aria-hidden="true"
      >
        {silk.map((strand, index) => {
          const length = lengths[index] ?? 1200;
          const delay = open ? (length / maxLen) * 150 : (1 - length / maxLen) * 90;
          const duration = open ? 0.58 + (length / maxLen) * 0.22 : 0.38;
          return (
            <path
              key={`${strand.kind}-${index}`}
              ref={(el) => {
                pathRefs.current[index] = el;
              }}
              className={`web-menu__strand web-menu__strand--${strand.kind}`}
              d={strand.d}
              style={{
                strokeDasharray: length,
                strokeDashoffset: open ? 0 : length,
                transition: `stroke-dashoffset ${duration}s ease-out ${delay}ms`,
              }}
            />
          );
        })}
      </svg>

      <div className="web-menu__panel" id="web-menu-panel" role="menu">
        {contact.tiles.map((tile, index) => (
          <a
            key={tile.id}
            className="web-menu__item"
            href={tile.href}
            role="menuitem"
            style={{ transitionDelay: panel ? `${index * 70}ms` : "0ms" }}
            {...(tile.href.startsWith("mailto:")
              ? {}
              : { target: "_blank", rel: "noreferrer noopener" })}
          >
            <span className="web-menu__icon">
              <MenuMark id={tile.id} />
            </span>
            <span>{tile.label}</span>
          </a>
        ))}
      </div>

      <svg
        className="web-menu__tension"
        viewBox={`0 0 ${stage.w} ${stage.h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <filter id="cord-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {dragging && taut > 2
          ? CORD.map((spread, i) => {
              const side = i % 2 === 0 ? 1 : -1;
              const x1 = anchor.x + nx * spread * 1.05;
              const y1 = anchor.y + ny * spread * 1.05;
              const x2 = anchor.x + pull.x - ux * rim + nx * spread * 0.32;
              const y2 = anchor.y + pull.y - uy * rim + ny * spread * 0.32;
              const c1x = anchor.x + spanX * 0.32 + nx * (spread * 0.2 + bow * side);
              const c1y = anchor.y + spanY * 0.32 + ny * (spread * 0.2 + bow * side);
              const c2x = anchor.x + spanX * 0.68 + nx * (spread * 0.2 - bow * side * 0.4);
              const c2y = anchor.y + spanY * 0.68 + ny * (spread * 0.2 - bow * side * 0.4);
              const core = Math.abs(spread) < 3;
              return (
                <path
                  key={spread}
                  className={`web-menu__cord${core ? " web-menu__cord--core" : ""}`}
                  d={`M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`}
                  style={{ strokeWidth: core ? coreW : hairW }}
                  filter="url(#cord-glow)"
                />
              );
            })
          : null}
        {dragging && taut > 2
          ? [0.28, 0.5, 0.72].map((t) => {
              const w = (12 - stretch * 4) * (1 - Math.abs(t - 0.5) * 0.3);
              const px = anchor.x + spanX * t + nx * bow * 0.12 * Math.sin(t * Math.PI);
              const py = anchor.y + spanY * t + ny * bow * 0.12 * Math.sin(t * Math.PI);
              return (
                <line
                  key={t}
                  className="web-menu__cord web-menu__cord--tie"
                  x1={px - nx * w}
                  y1={py - ny * w}
                  x2={px + nx * w}
                  y2={py + ny * w}
                />
              );
            })
          : null}
      </svg>

      <div className="web-menu__dock" ref={dockRef}>
        <div
          className="web-menu__aim"
          style={{ transform: `translate(${pull.x}px, ${pull.y}px)` }}
        >
          <button
            type="button"
            className="web-menu__trigger"
            aria-expanded={panel}
            aria-controls="web-menu-panel"
            aria-describedby="web-cast-hint"
            aria-label={pick(lang, contact.webTrigger)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="2.4" />
              <path d="M12 3.2v3M12 17.8v3M3.2 12h3M17.8 12h3" />
              <path d="M6.1 6.1l2.1 2.1M15.8 15.8l2.1 2.1M6.1 17.9l2.1-2.1M15.8 8.2l2.1-2.1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
