import { Plate } from "../Plate";
import { pick, ui, work } from "../../content/site";
import { useSite } from "../../context/SiteContext";

export function Work() {
  const { lang } = useSite();
  return (
    <Plate id="work" index={3} kicker={pick(lang, work.kicker)}>
      <h2 id="work-heading" className="title">
        {pick(lang, work.title)}
      </h2>
      <ul className="deck">
        {work.items.map((item) => (
          <li key={item.id}>
            <article className="card">
              <header>
                <span>{item.year}</span>
                <h3>{pick(lang, item.title)}</h3>
              </header>
              <p>{pick(lang, item.line)}</p>
              <ul className="tags">
                {item.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <p className="card__links">
                <a href={item.href} target="_blank" rel="noreferrer noopener">
                  {pick(lang, ui.repo)}
                </a>
                {item.live ? (
                  <a href={item.live} target="_blank" rel="noreferrer noopener">
                    {pick(lang, ui.demo)}
                  </a>
                ) : null}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </Plate>
  );
}
