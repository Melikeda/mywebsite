import { Plate } from "../Plate";
import { Mark } from "../Mark";
import { about, pick } from "../../content/site";
import { useSite } from "../../context/SiteContext";

export function About() {
  const { lang } = useSite();
  return (
    <Plate id="about" index={1} kicker={pick(lang, about.kicker)}>
      <h2 id="about-heading" className="title">
        {pick(lang, about.title)}
      </h2>
      <p className="hint">{pick(lang, about.hint)}</p>
      <ul className="polaroids">
        {about.cards.map((card, index) => (
          <li key={card.id} style={{ ["--tilt" as string]: `${(index % 2 === 0 ? -1 : 1) * (3 + (index % 3))}deg` }}>
            <details>
              <summary>
                <Mark kind={card.id} />
                <strong>{pick(lang, card.word)}</strong>
              </summary>
              <p>{pick(lang, card.caption)}</p>
            </details>
          </li>
        ))}
      </ul>
    </Plate>
  );
}
