import { PLATES, pick, ui } from "../content/site";
import { useSite } from "../context/SiteContext";

export function PlateNav() {
  const { lang, active } = useSite();
  if (active === 0) return null;

  return (
    <nav className="rail" aria-label="progress">
      {PLATES.map((id, index) => (
        <a
          key={id}
          href={`#${id}`}
          className={index === active ? "is-on" : undefined}
          aria-current={index === active ? "true" : undefined}
        >
          <span className="rail__dot" />
          <span className="rail__label">{pick(lang, ui.plates[id])}</span>
        </a>
      ))}
    </nav>
  );
}
