import { pick, ui, profile, PLATES, type Lang } from "../content/site";
import { useSite, type Theme, type ViewMode } from "../context/SiteContext";

export function Chrome() {
  const { lang, theme, view, setLang, setTheme, setView } = useSite();

  return (
    <>
      <a className="skip" href="#threshold">
        {pick(lang, ui.skip)}
      </a>
      <header className="chrome">
        <p className="chrome__name">{profile.fullName}</p>
        <nav className="chrome__nav" aria-label="plates">
          {PLATES.map((id) => (
            <a key={id} href={`#${id}`}>
              {pick(lang, ui.plates[id])}
            </a>
          ))}
        </nav>
        <div className="chrome__tools">
          <Segment
            ariaLabel="language"
            value={lang}
            options={[
              { value: "tr", label: "TR" },
              { value: "en", label: "EN" },
            ]}
            onChange={(value) => setLang(value as Lang)}
          />
          <Segment
            ariaLabel="theme"
            value={theme}
            options={[
              { value: "light", label: pick(lang, ui.paper) },
              { value: "dark", label: pick(lang, ui.ink) },
            ]}
            onChange={(value) => setTheme(value as Theme)}
          />
          <Segment
            ariaLabel="view"
            value={view}
            options={[
              { value: "folio", label: pick(lang, ui.folio) },
              { value: "flat", label: pick(lang, ui.flat) },
            ]}
            onChange={(value) => setView(value as ViewMode)}
          />
        </div>
      </header>
    </>
  );
}

type Option = { value: string; label: string };

function Segment({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <div className="seg" role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={option.value === value ? "is-on" : undefined}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
