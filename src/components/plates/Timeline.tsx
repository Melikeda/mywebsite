import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { Plate } from "../Plate";
import { timeline, pick, type Localized } from "../../content/site";
import { useSite } from "../../context/SiteContext";

const THEMES = ["gray", "teal", "blue", "green", "red", "orange", "magenta", "slate", "gold"] as const;
type TagTheme = (typeof THEMES)[number];

const themeByKey = new Map<string, TagTheme>();

function themeOf(key: string): TagTheme {
  const cached = themeByKey.get(key);
  if (cached) return cached;
  const theme = THEMES[themeByKey.size % THEMES.length];
  themeByKey.set(key, theme);
  return theme;
}

export function Timeline() {
  const { lang } = useSite();
  const listRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      list.classList.add("is-static");
      return undefined;
    }

    const items = [...list.querySelectorAll<HTMLElement>(".timeline > li")];
    const running: Array<{ revert: () => void }> = [];
    const observers: IntersectionObserver[] = [];
    const failsafe = window.setTimeout(() => list.classList.add("is-static"), 6000);

    items.forEach((item) => {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          window.clearTimeout(failsafe);
          running.push(
            animate(item, {
              opacity: [0, 1],
              y: [56, 0],
              duration: 820,
              ease: "outExpo",
            }),
          );
          io.disconnect();
        },
        { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(item);
      observers.push(io);
    });

    return () => {
      window.clearTimeout(failsafe);
      for (const io of observers) io.disconnect();
      for (const anim of running) anim.revert();
    };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    const needle = needleRef.current;
    const fill = fillRef.current;
    if (!list || !needle || !fill) return undefined;

    let frame = 0;
    let last = -1;

    const place = () => {
      const items = [...list.querySelectorAll<HTMLElement>(".timeline > li")];
      if (items.length === 0) return;
      const stage = list.getBoundingClientRect();
      const readY = window.innerHeight * 0.5;
      let active = 0;
      let nearest = Number.POSITIVE_INFINITY;
      items.forEach((item, index) => {
        const box = item.getBoundingClientRect();
        const mid = box.top + box.height / 2;
        const dist = Math.abs(mid - readY);
        if (dist < nearest) {
          nearest = dist;
          active = index;
        }
      });
      const box = items[active].getBoundingClientRect();
      const top = box.top + box.height / 2 - stage.top;
      needle.style.transform = `translate(-50%, ${Math.max(0, top)}px)`;
      fill.style.height = `${Math.max(12, top)}px`;
      if (active !== last) {
        last = active;
        items.forEach((item, index) => item.classList.toggle("is-now", index === active));
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    };

    place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <Plate id="timeline" index={1} className="plate--timeline">
      <h2 id="timeline-heading" className="title">
        {pick(lang, timeline.title)}
      </h2>
      <div ref={listRef} className="timeline-stage">
        <div className="timeline__rail" aria-hidden="true">
          <span className="timeline__line" />
          <span className="timeline__fill" ref={fillRef} />
          <span className="timeline__needle" ref={needleRef}>
            <svg viewBox="0 0 24 28" aria-hidden="true">
              <defs>
                <linearGradient id="needle-fire" x1="12" y1="2" x2="12" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#fff6b0" />
                  <stop offset="0.38" stopColor="#ffe14a" />
                  <stop offset="0.72" stopColor="#ff8c00" />
                  <stop offset="1" stopColor="#ff4500" />
                </linearGradient>
              </defs>
              <path fill="url(#needle-fire)" d="M12 2 22 24H2z" />
            </svg>
          </span>
        </div>
        <ol className="timeline">
          {timeline.stops.map((stop, index) => (
            <li key={stop.id} className={index % 2 === 1 ? "is-flip" : undefined}>
              <div className="time-block">
                <figure className={stop.photo ? "time-photo time-photo--shot" : "time-photo"}>
                  {stop.photo ? (
                    <img
                      className="time-photo__still"
                      src={stop.photo}
                      alt={stop.photoAlt ? pick(lang, stop.photoAlt) : pick(lang, stop.place)}
                      decoding="async"
                    />
                  ) : (
                    <div className="time-photo__empty">
                      {pick(lang, timeline.emptyPhoto)}
                    </div>
                  )}
                </figure>
                <div className="time-copy">
                  <p className="time-copy__when">{pick(lang, stop.when)}</p>
                  <h3>
                    {stop.href ? (
                      <a href={stop.href} target="_blank" rel="noreferrer noopener">
                        {pick(lang, stop.place)}
                      </a>
                    ) : (
                      pick(lang, stop.place)
                    )}
                  </h3>
                  {stop.role ? <p className="time-copy__role">{pick(lang, stop.role)}</p> : null}
                  {stop.note ? <p>{pick(lang, stop.note)}</p> : null}
                  {stop.tags ? (
                    <ul className="time-tags">
                      {stop.tags.map((tag: Localized) => {
                        const theme = themeOf(tag.en);
                        return (
                          <li key={tag.en} className={`time-tag time-tag--${theme}`}>
                            {pick(lang, tag)}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Plate>
  );
}
