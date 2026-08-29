import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { Plate } from "../Plate";
import { timeline, pick } from "../../content/site";
import { useSite } from "../../context/SiteContext";

export function Timeline() {
  const { lang } = useSite();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      list.classList.add("is-static");
      return undefined;
    }

    const line = list.querySelector<HTMLElement>(".timeline__line");
    const items = [...list.querySelectorAll<HTMLElement>(".timeline > li")];
    const dots = [...list.querySelectorAll<HTMLElement>(".timeline__dot")];
    const running: Array<{ revert: () => void }> = [];
    const observers: IntersectionObserver[] = [];

    const playLine = () => {
      if (!line) return;
      running.push(
        animate(line, {
          scaleY: [0, 1],
          duration: 1200,
          ease: "inOutCubic",
        }),
      );
    };

    let lineStarted = false;
    const failsafe = window.setTimeout(() => list.classList.add("is-static"), 6000);

    items.forEach((item, index) => {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          window.clearTimeout(failsafe);
          if (!lineStarted) {
            lineStarted = true;
            playLine();
          }
          running.push(
            animate(item, {
              opacity: [0, 1],
              y: [56, 0],
              duration: 820,
              ease: "outExpo",
            }),
          );
          const dot = dots[index];
          if (dot) {
            running.push(
              animate(dot, {
                scale: [0, 1],
                duration: 540,
                ease: "outBack",
              }),
            );
          }
          io.disconnect();
        },
        { threshold: 0.22, rootMargin: "0px 0px -8% 0px" },
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

  return (
    <Plate id="timeline" index={1}>
      <h2 id="timeline-heading" className="title">
        {pick(lang, timeline.title)}
      </h2>
      <div ref={listRef} className="timeline-stage">
        <span className="timeline__line" aria-hidden="true" />
        <ol className="timeline">
          {timeline.stops.map((stop, index) => (
            <li key={stop.id} className={index % 2 === 1 ? "is-flip" : undefined}>
              <span className="timeline__dot" />
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
                    {stop.tags.map((tag) => (
                      <li key={tag.en}>{pick(lang, tag)}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Plate>
  );
}
