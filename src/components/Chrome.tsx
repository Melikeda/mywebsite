import { pick, ui, profile, PLATES, type Lang } from "../content/site";
import { useSite, type Theme } from "../context/SiteContext";

export function Chrome() {
  const { lang, theme, setLang, setTheme } = useSite();

  return (
    <>
      <a className="skip" href="#profile">
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
          <Toggle
            ariaLabel="language"
            value={lang}
            options={[
              { value: "tr", label: "TR" },
              { value: "en", label: "EN" },
            ]}
            onChange={(value) => setLang(value as Lang)}
          />
          <Toggle
            className="toggle--theme"
            ariaLabel={pick(lang, ui.theme)}
            value={theme}
            options={[
              { value: "light", label: pick(lang, ui.paper) },
              { value: "dark", label: pick(lang, ui.ink) },
            ]}
            onChange={(value) => setTheme(value as Theme)}
          />
        </div>
      </header>
    </>
  );
}

type Option = { value: string; label: string };

function Toggle({
  value,
  options,
  onChange,
  ariaLabel,
  className,
}: {
  value: string;
  options: [Option, Option] | Option[];
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}) {
  const on = options[1]?.value === value;
  return (
    <button
      type="button"
      className={`toggle${on ? " is-on" : ""}${className ? ` ${className}` : ""}`}
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      onClick={() => onChange(on ? options[0].value : options[1].value)}
    >
      <span className="toggle__knob" aria-hidden="true" />
      <span className="toggle__opt">{options[0].label}</span>
      <span className="toggle__opt">{options[1].label}</span>
    </button>
  );
}
