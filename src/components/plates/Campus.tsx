import { Plate } from "../Plate";
import { campus, pick } from "../../content/site";
import { useSite } from "../../context/SiteContext";

export function Campus() {
  const { lang } = useSite();
  return (
    <Plate id="campus" index={2} kicker={pick(lang, campus.kicker)}>
      <h2 id="campus-heading" className="title">
        {pick(lang, campus.title)}
      </h2>
      <ol className="stations">
        {campus.stations.map((station) => (
          <li key={station.mark}>
            <a href={station.href} target="_blank" rel="noreferrer noopener">
              <span className="stations__mark">{station.mark}</span>
              <span>
                <strong>{pick(lang, station.place)}</strong>
                <em>{pick(lang, station.role)}</em>
                <span>{pick(lang, station.note)}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </Plate>
  );
}
