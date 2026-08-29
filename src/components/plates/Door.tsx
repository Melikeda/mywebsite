import { Plate } from "../Plate";
import { door, pick, profile, ui } from "../../content/site";
import { useSite } from "../../context/SiteContext";

export function Door() {
  const { lang } = useSite();
  return (
    <Plate id="door" index={6} kicker={pick(lang, door.kicker)}>
      <h2 id="door-heading" className="title">
        {pick(lang, door.title)}
      </h2>
      <p className="lede">{pick(lang, door.body)}</p>
      <p className="exits">
        <a className="btn" href={profile.links.linkedin} target="_blank" rel="noreferrer noopener">
          LinkedIn
        </a>
        <a className="btn" href={profile.links.github} target="_blank" rel="noreferrer noopener">
          GitHub
        </a>
        <a className="btn btn--ghost" href={profile.links.medium} target="_blank" rel="noreferrer noopener">
          Medium
        </a>
      </p>
      <p className="credit">{pick(lang, door.credit)}</p>
      <p className="hint">{pick(lang, ui.open)} · Vite · React · TypeScript</p>
    </Plate>
  );
}
