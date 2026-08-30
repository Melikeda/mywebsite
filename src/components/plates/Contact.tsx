import { Plate } from "../Plate";
import { WebMenu } from "../WebMenu";
import { contact, pick } from "../../content/site";
import { useSite } from "../../context/SiteContext";

export function Contact() {
  const { lang } = useSite();
  return (
    <Plate id="contact" index={3} className="plate--contact">
      <div className="contact-void">
        <div className="contact-void__copy">
          <h2 id="contact-heading" className="contact-void__title">
            {pick(lang, contact.title)}
          </h2>
          <p className="contact-void__hint" id="web-cast-hint">
            {pick(lang, contact.webHint)}
          </p>
        </div>
        <WebMenu lang={lang} />
      </div>
    </Plate>
  );
}
