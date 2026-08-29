import { useEffect, useRef, useState } from "react";
import { contact, pick, type Lang } from "../content/site";

const VW = 400;
const VH = 460;
const BX = 200;
const BY = 318;
const CARD_REST = { x: 200, y: 124 };
const RADIALS = 13;
const LOOPS = 8;
const SPREAD = 1.12;
const TETHERS = [-56, -28, 0, 28, 56] as const;

type MeshNode = {
  x: number;
  y: number;
  px: number;
  py: number;
  ox: number;
  oy: number;
  pin: boolean;
};

type Edge = { a: number; b: number; len: number; slack?: boolean };

function idx(loop: number, radial: number) {
  return 1 + loop * RADIALS + radial;
}

function angleOf(radial: number) {
  return -SPREAD + (radial / (RADIALS - 1)) * SPREAD * 2 + Math.sin(radial * 1.7) * 0.02;
}

function createFan() {
  const nodes: MeshNode[] = [
    { x: BX, y: BY, px: BX, py: BY, ox: BX, oy: BY, pin: true },
  ];

  for (let loop = 0; loop < LOOPS; loop += 1) {
    for (let radial = 0; radial < RADIALS; radial += 1) {
      const angle = angleOf(radial);
      const t = (loop + radial / (RADIALS - 1)) / LOOPS;
      const radius = 20 + t * 248 + Math.sin(loop * 1.6 + radial * 1.2) * 2.2;
      const ox = BX + Math.sin(angle) * radius;
      const oy = BY - Math.cos(angle) * radius;
      nodes.push({ x: ox, y: oy, px: ox, py: oy, ox, oy, pin: false });
    }
  }

  const edges: Edge[] = [];
  const add = (a: number, b: number, slack = false) => {
    const chord = Math.hypot(nodes[a].ox - nodes[b].ox, nodes[a].oy - nodes[b].oy);
    edges.push({ a, b, len: slack ? chord * 1.32 : chord, slack });
  };

  for (let radial = 0; radial < RADIALS; radial += 1) {
    add(0, idx(0, radial));
    for (let loop = 0; loop < LOOPS - 1; loop += 1) add(idx(loop, radial), idx(loop + 1, radial));
  }
  for (let loop = 0; loop < LOOPS; loop += 1) {
    for (let radial = 0; radial < RADIALS - 1; radial += 1) {
      add(idx(loop, radial), idx(loop, radial + 1), true);
    }
  }

  return { nodes, edges };
}

const FAN = createFan();

function cloneNodes(): MeshNode[] {
  return FAN.nodes.map((node) => ({ ...node, x: node.ox, y: node.oy, px: node.ox, py: node.oy }));
}

function linePath(points: MeshNode[]) {
  return points
    .map((point, i) => `${i ? "L" : "M"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");
}

function slackPath(points: MeshNode[], hub: MeshNode) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const mx = (a.x + b.x) * 0.5;
    const my = (a.y + b.y) * 0.5;
    const chord = Math.hypot(b.x - a.x, b.y - a.y);
    let ux = mx - hub.x;
    let uy = my - hub.y;
    const ulen = Math.hypot(ux, uy) || 1;
    ux /= ulen;
    uy /= ulen;
    const cx = mx + ux * chord * 0.22;
    const cy = my + uy * chord * 0.12 + chord * 0.42;
    d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  return d;
}

function prefersReduce() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ItemMark({ id }: { id: string }) {
  if (id === "linkedin") {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <rect x="3" y="3" width="14" height="14" rx="3" />
        <path d="M7 9v6M7 6.2v.2M10.2 15v-3.6c0-1.2.8-1.6 1.6-1.6s1.6.5 1.6 1.6V15" />
      </svg>
    );
  }
  if (id === "github") {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="6.2" />
        <path d="M7.4 12.6c1.2.8 4 .8 5.2 0M8 8.4v.3M12 8.4v.3" />
      </svg>
    );
  }
  if (id === "kaggle") {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M7 5v10M7 10l6-5M7 10l6 5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 6h3.4c2.2 0 3.4 1 3.4 2.5S10.6 11 8.4 11H5zM8.2 11H12c2 0 3.2.9 3.2 2.4S14 16 12 16H5" />
    </svg>
  );
}

export function WebCast({ lang }: { lang: Lang }) {
  const labelId = `web-hint-${lang}`;
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const radialRefs = useRef<(SVGPathElement | null)[]>([]);
  const ringRefs = useRef<(SVGPathElement | null)[]>([]);
  const springRefs = useRef<(SVGPathElement | null)[]>([]);
  const tetherRefs = useRef<(SVGPathElement | null)[]>([]);
  const nodesRef = useRef<MeshNode[]>(cloneNodes());
  const openRef = useRef(false);
  const growRef = useRef(0);
  const growVRef = useRef(0);
  const pullRef = useRef({ x: 0, y: 0 });
  const pullVRef = useRef({ x: 0, y: 0 });
  const recoilRef = useRef(false);
  const firedRef = useRef(false);
  const kickRef = useRef({ x: 0, y: 0 });
  const shakeRef = useRef(false);
  const timeRef = useRef(0);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [pulling, setPulling] = useState(false);

  useEffect(() => {
    if (prefersReduce()) {
      openRef.current = true;
      setOpen(true);
      growRef.current = 1;
    }
  }, []);

  useEffect(() => {
    openRef.current = open;
    if (!open || prefersReduce()) return;
    const nodes = nodesRef.current;
    const kickX = kickRef.current.x * 0.1;
    const kickY = kickRef.current.y * 0.1;
    for (const node of nodes) {
      if (node.pin) continue;
      node.x = BX + (node.ox - BX) * 0.05;
      node.y = BY + (node.oy - BY) * 0.05;
      node.px = node.x - (node.ox - BX) * 0.2 - kickX;
      node.py = node.y - (node.oy - BY) * 0.2 - kickY;
    }
    growRef.current = 0.06;
    growVRef.current = 0.38;
  }, [open]);

  useEffect(() => {
    let frame = 0;
    const reduced = prefersReduce();
    const tick = () => {
      timeRef.current += 0.016;
      const opened = openRef.current;
      const pullingNow = drag.current !== null;

      if (!pullingNow && recoilRef.current && !reduced) {
        const pull = pullRef.current;
        const vel = pullVRef.current;
        vel.x += -pull.x * 0.22;
        vel.y += -pull.y * 0.22;
        vel.x *= 0.84;
        vel.y *= 0.84;
        pull.x += vel.x;
        pull.y += vel.y;
        if (!firedRef.current && Math.hypot(pull.x, pull.y) < 16 && Math.hypot(vel.x, vel.y) > 1.8) {
          firedRef.current = true;
          setOpen(true);
        }
        if (Math.hypot(pull.x, pull.y) < 0.8 && Math.hypot(vel.x, vel.y) < 0.35) {
          pull.x = 0;
          pull.y = 0;
          vel.x = 0;
          vel.y = 0;
          recoilRef.current = false;
        }
      }

      const pull = pullRef.current;
      const pullLen = Math.hypot(pull.x, pull.y);
      const target = opened ? 1 : 0;
      if (reduced) {
        growRef.current = target;
        growVRef.current = 0;
      } else {
        growVRef.current += (target - growRef.current) * 0.065;
        growVRef.current *= 0.87;
        growRef.current += growVRef.current;
      }
      const grow = Math.max(0, growRef.current);

      const stage = stageRef.current;
      const sx = stage ? VW / Math.max(stage.clientWidth, 1) : 1;
      const sy = stage ? VH / Math.max(stage.clientHeight, 1) : 1;
      const nodes = nodesRef.current;
      const hub = nodes[0];
      hub.x = BX + pull.x * sx;
      hub.y = BY + pull.y * sy;
      hub.px = hub.x;
      hub.py = hub.y;

      if (reduced) {
        for (const node of nodes) {
          if (node.pin) continue;
          node.x = hub.x + (node.ox - BX) * grow;
          node.y = hub.y + (node.oy - BY) * grow;
        }
      } else {
        const shaking = shakeRef.current;
        const wave = opened ? (shaking ? 1.65 : 0.2) : 0;
        const time = timeRef.current;
        const flutter = shaking ? 28 : 1.45;
        for (let i = 1; i < nodes.length; i += 1) {
          const node = nodes[i];
          const restX = hub.x + (node.ox - BX) * grow;
          const restY = hub.y + (node.oy - BY) * grow;
          const vx = (node.x - node.px) * (shaking ? 0.88 : 0.93);
          const vy = (node.y - node.py) * (shaking ? 0.88 : 0.93);
          node.px = node.x;
          node.py = node.y;
          node.x +=
            vx +
            (restX - node.x) * 0.12 +
            Math.sin(time * flutter + i * 0.2) * wave +
            (shaking ? (Math.random() - 0.5) * 0.85 : 0);
          node.y +=
            vy +
            (restY - node.y) * 0.12 +
            0.03 * grow +
            (shaking ? (Math.random() - 0.5) * 0.85 : 0);
        }
        for (let pass = 0; pass < 4; pass += 1) {
          for (const edge of FAN.edges) {
            const a = nodes[edge.a];
            const b = nodes[edge.b];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            const shift = ((dist - edge.len * Math.max(grow, 0.04)) / dist) * 0.5;
            if (!a.pin) {
              a.x += dx * shift;
              a.y += dy * shift;
            }
            if (!b.pin) {
              b.x -= dx * shift;
              b.y -= dy * shift;
            }
          }
        }
      }

      for (let radial = 0; radial < RADIALS; radial += 1) {
        const pts = [nodes[0]];
        for (let loop = 0; loop < LOOPS; loop += 1) pts.push(nodes[idx(loop, radial)]);
        radialRefs.current[radial]?.setAttribute("d", linePath(pts));
      }

      for (let loop = 0; loop < LOOPS; loop += 1) {
        const pts = Array.from({ length: RADIALS }, (_, radial) => nodes[idx(loop, radial)]);
        ringRefs.current[loop]?.setAttribute("d", slackPath(pts, hub));
      }

      const springOn = pullLen > 6 && !opened;
      const restX = BX;
      const restY = BY;
      [-8, -3, 3, 8].forEach((offset, index) => {
        const mx = (restX + hub.x) * 0.5 + offset * 0.15;
        const my = (restY + hub.y) * 0.5 + 10 + Math.sin(timeRef.current * 10 + index) * 1.2;
        springRefs.current[index]?.setAttribute(
          "d",
          springOn
            ? `M ${restX + offset * 0.2} ${restY} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${hub.x + offset * 0.15} ${hub.y}`
            : "",
        );
      });

      TETHERS.forEach((offset, index) => {
        const show = opened && grow > 0.18;
        const ex = CARD_REST.x + offset;
        const ey = CARD_REST.y + 74;
        const mx = (hub.x + ex) * 0.5 + offset * 0.08;
        const my = (hub.y - 18 + ey) * 0.5 + 12;
        tetherRefs.current[index]?.setAttribute(
          "d",
          show
            ? `M ${hub.x.toFixed(1)} ${(hub.y - 18).toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex} ${ey}`
            : "",
        );
      });

      const cardEl = cardRef.current;
      if (cardEl) {
        cardEl.style.left = `${(CARD_REST.x / VW) * 100}%`;
        cardEl.style.top = `${(CARD_REST.y / VH) * 100}%`;
        cardEl.style.transform = `translate(-50%, -50%) scale(${opened && grow > 0.35 ? 1 : 0.12})`;
        cardEl.style.opacity = opened && grow > 0.35 ? "1" : "0";
      }

      if (stage) {
        stage.style.setProperty("--web-grow", Math.min(1, grow).toFixed(3));
        stage.style.setProperty("--dx", `${pull.x}px`);
        stage.style.setProperty("--dy", `${pull.y}px`);
        stage.classList.toggle("is-recoil", recoilRef.current);
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  function stirWeb() {
    if (prefersReduce()) return;
    shakeRef.current = true;
    for (const node of nodesRef.current) {
      if (node.pin) continue;
      node.px -= (Math.random() - 0.5) * 5.5;
      node.py -= (Math.random() - 0.5) * 5.5;
    }
  }

  function stillWeb() {
    shakeRef.current = false;
  }

  function resetPull() {
    pullRef.current = { x: 0, y: 0 };
    pullVRef.current = { x: 0, y: 0 };
    recoilRef.current = false;
    setPulling(false);
  }

  function releaseSpring() {
    const pull = pullRef.current;
    const dist = Math.hypot(pull.x, pull.y);
    drag.current = null;
    setPulling(false);
    if (dist < 18) {
      resetPull();
      return;
    }
    kickRef.current = { ...pull };
    pullVRef.current = { x: -pull.x * 0.28, y: -pull.y * 0.28 };
    recoilRef.current = true;
    firedRef.current = false;
  }

  function onPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (open) {
      setOpen(false);
      resetPull();
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    recoilRef.current = false;
    firedRef.current = false;
    setPulling(true);
  }

  function onPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const session = drag.current;
    if (!session || session.id !== event.pointerId) return;
    pullRef.current = {
      x: Math.max(-130, Math.min(130, event.clientX - session.x)),
      y: Math.max(-40, Math.min(140, event.clientY - session.y)),
    };
  }

  function onPointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    const session = drag.current;
    if (!session || session.id !== event.pointerId) return;
    releaseSpring();
  }

  return (
    <div className={`web-cast${open ? " is-open" : ""}${pulling ? " is-pulling" : ""}`}>
      <p className="web-cast__hint" id={labelId}>
        {pick(lang, contact.webHint)}
      </p>
      <div className="web-cast__stage" ref={stageRef}>
        <svg className="web-cast__web" viewBox={`0 0 ${VW} ${VH}`} aria-hidden="true">
          {Array.from({ length: LOOPS }, (_, loop) => (
            <path
              key={`ring-${loop}`}
              ref={(el) => {
                ringRefs.current[loop] = el;
              }}
              className="web-cast__silk web-cast__silk--spiral"
            />
          ))}
          {Array.from({ length: RADIALS }, (_, radial) => (
            <path
              key={radial}
              ref={(el) => {
                radialRefs.current[radial] = el;
              }}
              className="web-cast__silk web-cast__silk--spoke"
            />
          ))}
          {[-8, -3, 3, 8].map((offset, index) => (
            <path
              key={`spring-${offset}`}
              ref={(el) => {
                springRefs.current[index] = el;
              }}
              className="web-cast__silk web-cast__silk--spring"
            />
          ))}
          {TETHERS.map((offset, index) => (
            <path
              key={`tether-${offset}`}
              ref={(el) => {
                tetherRefs.current[index] = el;
              }}
              className="web-cast__silk web-cast__silk--tether"
            />
          ))}
        </svg>
        <div
          ref={cardRef}
          id="web-cast-menu"
          className="web-cast__card"
          style={{ left: "50%", top: "27%", opacity: 0, transform: "translate(-50%, -50%) scale(0.12)" }}
        >
          {contact.tiles.map((tile) => (
            <a
              key={tile.id}
              className={`web-cast__item${tile.id === "linkedin" ? " web-cast__item--linkedin" : ""}`}
              href={tile.href}
              target="_blank"
              rel="noreferrer noopener"
              tabIndex={open ? 0 : -1}
              onMouseEnter={stirWeb}
              onMouseLeave={stillWeb}
              onFocus={stirWeb}
              onBlur={stillWeb}
            >
              <ItemMark id={tile.id} />
              <span>{tile.label}</span>
            </a>
          ))}
        </div>
        <div className="web-cast__aim">
          <button
            type="button"
            className="web-cast__trigger"
            aria-expanded={open}
            aria-controls="web-cast-menu"
            aria-describedby={labelId}
            aria-label={pick(lang, contact.webTrigger)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              if (open) {
                setOpen(false);
                resetPull();
                return;
              }
              kickRef.current = { x: 0, y: 70 };
              pullRef.current = { x: 0, y: 70 };
              pullVRef.current = { x: 0, y: -22 };
              recoilRef.current = true;
              firedRef.current = false;
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="3.2" />
              <path d="M12 3.4v3.2M12 17.4v3.2M3.4 12h3.2M17.4 12h3.2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
