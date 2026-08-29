import { Plate } from "../Plate";
import { pick, worlds } from "../../content/site";
import { useSite } from "../../context/SiteContext";

export function Worlds() {
  const { lang } = useSite();
  return (
    <Plate id="worlds" index={4} kicker={pick(lang, worlds.kicker)}>
      <h2 id="worlds-heading" className="title">
        {pick(lang, worlds.title)}
      </h2>
      <ul className="bento">
        {worlds.tiles.map((tile) => (
          <li key={tile.id} className={`bento__${tile.id}`}>
            <a href={tile.href} target="_blank" rel="noreferrer noopener">
              <span>{tile.label}</span>
              <strong>{pick(lang, tile.blurb)}</strong>
            </a>
          </li>
        ))}
      </ul>
    </Plate>
  );
}
