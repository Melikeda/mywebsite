import { Plate } from "../Plate";
import { pick, threshold } from "../../content/site";
import { useSite } from "../../context/SiteContext";

export function Threshold() {
  const { lang } = useSite();
  return (
    <Plate id="threshold" index={0} kicker={pick(lang, threshold.kicker)}>
      <p className="eyebrow" id="threshold-heading">
        {pick(lang, threshold.role)}
      </p>
      <h1 className="display">
        <span>{pick(lang, threshold.line)}</span>
      </h1>
      <p className="lede">{pick(lang, threshold.aside)}</p>
    </Plate>
  );
}
