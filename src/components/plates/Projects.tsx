import { Plate } from "../Plate";
import { YoloPhone } from "../YoloPhone";
import { pick, projects, ui } from "../../content/site";
import { useSite } from "../../context/SiteContext";

export function Projects() {
  const { lang } = useSite();

  return (
    <Plate id="projects" index={2} className="plate--yolo">
      <div className="yolo">
        <div className="yolo__pills" aria-hidden="true">
          <span className="yolo-cap yolo-cap--mint" />
          <span className="yolo-cap yolo-cap--pink" />
          <span className="yolo-cap yolo-cap--blue" />
          <span className="yolo-cap yolo-cap--gold" />
          <span className="yolo-cap yolo-cap--mint" />
          <span className="yolo-cap yolo-cap--blue" />
          <span className="yolo-cap yolo-cap--pink" />
          <span className="yolo-cap yolo-cap--gold" />
          <span className="yolo-cap yolo-cap--mint" />
          <span className="yolo-cap yolo-cap--blue" />
        </div>
        <div className="yolo__copy">
          <h2 id="projects-heading" className="title">
            {pick(lang, projects.title)}
          </h2>
          <p className="lede">{pick(lang, projects.line)}</p>
          <ol className="yolo-beats">
            {projects.beats.map((beat, index) => (
              <li key={beat.n} style={{ animationDelay: `${index * 2.8}s` }}>
                <span>{beat.n}</span>
                <strong>{pick(lang, beat.word)}</strong>
                <em>{pick(lang, beat.note)}</em>
              </li>
            ))}
          </ol>
          <p className="yolo__links">
            <a className="btn" href={projects.href} target="_blank" rel="noreferrer noopener">
              {pick(lang, ui.repo)}
            </a>
            <a
              className="btn btn--ghost"
              href={projects.dataset.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {pick(lang, projects.dataset.label)}
            </a>
          </p>
          <p className="hint">{pick(lang, projects.disclaimer)}</p>
        </div>

        <YoloPhone />
      </div>
    </Plate>
  );
}
