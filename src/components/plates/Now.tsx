import { Plate } from "../Plate";
import { now, pick } from "../../content/site";
import { useSite } from "../../context/SiteContext";

export function Now() {
  const { lang } = useSite();
  const loop = [...now.items, ...now.items];
  return (
    <Plate id="now" index={5} kicker={pick(lang, now.kicker)}>
      <h2 id="now-heading" className="title">
        {pick(lang, now.title)}
      </h2>
      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {loop.map((item, index) => (
            <span key={`${item.en}-${index}`}>{pick(lang, item)}</span>
          ))}
        </div>
      </div>
      <ul className="now-list">
        {now.items.map((item) => (
          <li key={item.en}>{pick(lang, item)}</li>
        ))}
      </ul>
    </Plate>
  );
}
