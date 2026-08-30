import { useEffect, useRef, useState } from "react";
import { Plate } from "../Plate";
import { intro, pick, profile } from "../../content/site";
import { useSite } from "../../context/SiteContext";

const EMPTY_SLOTS = 4;
const YAW = -34;
const LAPS = 2;
const EXIT = 1.35;

type Frame = { src: string; alt: { tr: string; en: string } };

type OpenShot = {
  src: string;
  alt: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

function cardSlot(index: number, scroll: number, count: number, laps: number) {
  let best = Number.POSITIVE_INFINITY;
  for (let lap = 0; lap < laps; lap += 1) {
    const pos = index + lap * count - scroll;
    if (pos < -EXIT) continue;
    if (pos < best) best = pos;
  }
  return best;
}

type LakeWash = { up: string; down: string };

const lakeCache = new Map<string, LakeWash>();

function rgbAt(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
): string {
  const i = (y * width + x) * 4;
  return `${data[i]} ${data[i + 1]} ${data[i + 2]}`;
}

function sampleLake(src: string): Promise<LakeWash> {
  const hit = lakeCache.get(src);
  if (hit) return Promise.resolve(hit);
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 8;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        resolve({ up: "none", down: "none" });
        return;
      }
      ctx.drawImage(image, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);
      const a = rgbAt(data, size, 1, 1);
      const b = rgbAt(data, size, 6, 2);
      const c = rgbAt(data, size, 3, 4);
      const d = rgbAt(data, size, 2, 6);
      const e = rgbAt(data, size, 6, 6);
      const wash: LakeWash = {
        up: `radial-gradient(ellipse 90% 80% at 28% 80%, rgb(${a} / 0.55), transparent 70%),
          radial-gradient(ellipse 80% 75% at 72% 70%, rgb(${b} / 0.42), transparent 72%),
          linear-gradient(to top, rgb(${c} / 0.38), transparent 78%)`,
        down: `radial-gradient(ellipse 90% 80% at 30% 20%, rgb(${d} / 0.55), transparent 70%),
          radial-gradient(ellipse 80% 75% at 74% 28%, rgb(${e} / 0.42), transparent 72%),
          linear-gradient(to bottom, rgb(${c} / 0.38), transparent 78%)`,
      };
      lakeCache.set(src, wash);
      resolve(wash);
    };
    image.onerror = () => resolve({ up: "none", down: "none" });
    image.src = src;
  });
}

function LakeMirrors({ src }: { src: string }) {
  const [wash, setWash] = useState<LakeWash>({ up: "none", down: "none" });

  useEffect(() => {
    let live = true;
    sampleLake(src).then((next) => {
      if (live) setWash(next);
    });
    return () => {
      live = false;
    };
  }, [src]);

  return (
    <>
      <span
        className="unveil__mirror unveil__mirror--up"
        aria-hidden="true"
        style={{ backgroundImage: wash.up }}
      />
      <span
        className="unveil__mirror unveil__mirror--down"
        aria-hidden="true"
        style={{ backgroundImage: wash.down }}
      />
    </>
  );
}

function UnveilGallery({ frames, lang }: { frames: Frame[]; lang: "tr" | "en" }) {
  const { active } = useSite();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollRef = useRef(0);
  const velocityRef = useRef(0);
  const hoverRef = useRef<number | null>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const pauseRef = useRef(false);
  const leftRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [shot, setShot] = useState<OpenShot | null>(null);
  const [grown, setGrown] = useState(false);
  const count = Math.max(frames.length, 1);
  const tour = count * LAPS;

  const goNext = () => {
    if (leftRef.current || pauseRef.current) return;
    leftRef.current = true;
    velocityRef.current = 0;
    document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (active === 0) {
      leftRef.current = false;
      scrollRef.current = 0;
      velocityRef.current = 0;
    }
  }, [active]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const onWheel = (event: WheelEvent) => {
      if (shot || active !== 0) return;
      const delta = event.deltaY + event.deltaX;
      const done = scrollRef.current >= tour - 0.04;
      if (done && delta > 0) {
        event.preventDefault();
        goNext();
        return;
      }
      if (scrollRef.current <= 0 && delta < 0) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      velocityRef.current += Math.sign(delta) * Math.min(Math.abs(delta) * 0.0032, 0.28);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (shot || event.button !== 0) return;
      movedRef.current = false;
      dragRef.current = { x: event.clientX, y: event.clientY };
      setDragging(true);
      stage.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) movedRef.current = true;
      velocityRef.current -= (dx - dy) * 0.006;
      drag.x = event.clientX;
      drag.y = event.clientY;
    };

    const onPointerUp = (event: PointerEvent) => {
      dragRef.current = null;
      setDragging(false);
      if (stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    return () => {
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
    };
  }, [active, shot, tour]);

  useEffect(() => {
    let frameId = 0;

    const tick = () => {
      const wide = window.innerWidth / window.innerHeight;
      const size = Math.min(window.innerWidth * 0.22, window.innerHeight * 0.3, 240);
      const step = size * 0.7;
      const depth = wide < 1 ? 4.6 : Math.min(wide, 1.7) * 2.25;

      velocityRef.current *= dragRef.current ? 0.86 : 0.92;
      if (Math.abs(velocityRef.current) < 0.00008) velocityRef.current = 0;
      scrollRef.current += velocityRef.current;
      if (scrollRef.current < 0) {
        scrollRef.current = 0;
        if (velocityRef.current < 0) velocityRef.current = 0;
      }
      if (scrollRef.current >= tour) {
        scrollRef.current = tour;
        velocityRef.current = 0;
        goNext();
      }

      cardRefs.current.forEach((el, index) => {
        if (!el) return;
        const slot = cardSlot(index, scrollRef.current, count, LAPS);
        if (!Number.isFinite(slot)) {
          el.style.visibility = "hidden";
          el.style.pointerEvents = "none";
          el.style.opacity = "0";
          return;
        }
        const x = slot * step;
        const y = x * 0.48;
        const z = -x * depth;
        const lift = hoverRef.current === index ? 1 : 0;
        const fadeRight = slot > 2 ? Math.max(0, 1 - (slot - 2) / 0.55) : 1;
        const fadeLeft = slot < -0.28 ? Math.max(0, 1 + (slot + 0.28) / (EXIT - 0.28)) : 1;
        const fade = Math.min(fadeRight, fadeLeft);
        const scale = slot < 0
          ? Math.min(1.34, 1 - slot * 0.22)
          : Math.max(0.34, 1 - slot * 0.22);
        const near = fade > 0.02;
        el.style.visibility = near ? "visible" : "hidden";
        el.style.pointerEvents = near && !shot ? "auto" : "none";
        el.style.transform = `translate(-50%, -50%) translate3d(${x + lift * 10}px, ${y + lift * -8}px, ${z + lift * 48}px) rotateY(${YAW}deg) scale(${scale})`;
        el.style.zIndex = String(Math.round(400 + z + lift * 80));
        el.style.opacity = String(fade);
      });

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [count, shot, tour]);

  useEffect(() => {
    if (!shot) {
      setGrown(false);
      pauseRef.current = false;
      return undefined;
    }
    pauseRef.current = true;
    const id = requestAnimationFrame(() => setGrown(true));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShot(null);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [shot]);

  return (
    <div
      className={`unveil${shot ? " is-open" : ""}${dragging ? " is-drag" : ""}`}
      ref={stageRef}
    >
      <div className="unveil__space" aria-hidden={Boolean(shot)}>
        <div className="unveil__world">
          {frames.map((frame, index) => {
            const source = frame.src;
            const alt = source ? pick(lang, frame.alt) : "";
            return (
              <button
                key={`${source || "slot"}-${index}`}
                type="button"
                className="unveil__card"
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onMouseEnter={() => {
                  hoverRef.current = index;
                }}
                onMouseLeave={() => {
                  hoverRef.current = null;
                }}
                onClick={(event) => {
                  if (!source || movedRef.current) return;
                  const box = event.currentTarget.getBoundingClientRect();
                  setShot({
                    src: source,
                    alt,
                    x: box.left,
                    y: box.top,
                    w: box.width,
                    h: box.height,
                  });
                }}
              >
                {source ? (
                  <>
                    <LakeMirrors src={source} />
                    <span className="unveil__face">
                      <img src={source} alt={alt} decoding="async" />
                    </span>
                  </>
                ) : (
                  <span className="unveil__face">{String(index + 1).padStart(2, "0")}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="unveil__vignette" aria-hidden="true" />
      {shot ? (
        <div
          className={`unveil__full${grown ? " is-in" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={shot.alt}
          onClick={() => setShot(null)}
        >
          <img
            src={shot.src}
            alt={shot.alt}
            style={{
              ["--x" as string]: `${shot.x}px`,
              ["--y" as string]: `${shot.y}px`,
              ["--w" as string]: `${shot.w}px`,
              ["--h" as string]: `${shot.h}px`,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

export function Profile() {
  const { lang } = useSite();
  const frames: Frame[] =
    intro.film.length > 0
      ? intro.film
      : Array.from({ length: EMPTY_SLOTS }, (_, index) => ({
          src: "",
          alt: { tr: `Kare ${index + 1}`, en: `Frame ${index + 1}` },
        }));

  return (
    <Plate id="profile" index={0} className="plate--hero">
      <UnveilGallery frames={frames} lang={lang} />
      <div className="intro intro--hero">
        <h1 className="intro__name" id="profile-heading">
          {profile.fullName}
        </h1>
        <p className="intro__role">{pick(lang, intro.role)}</p>
        <p className="intro__school">{pick(lang, intro.school)}</p>
      </div>
    </Plate>
  );
}
