import { Plate } from "../Plate";
import { EarthFly } from "../EarthFly";
import { WebCast } from "../WebCast";
import { contact, pick, profile } from "../../content/site";
import { useSite } from "../../context/SiteContext";

export function Contact() {
  const { lang } = useSite();
  return (
    <Plate id="contact" index={3}>
      <h2 id="contact-heading" className="title">
        {pick(lang, contact.title)}
      </h2>
      <WebCast lang={lang} />
      <p className="contact-mail">
        <span>{pick(lang, contact.mailLabel)}</span>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
      <p className="contact-campus">{pick(lang, contact.campusNote)}</p>
      <EarthFly
        lang={lang}
        photo={contact.campusPhoto}
        photoAlt={pick(lang, contact.campusPhotoAlt)}
      />
    </Plate>
  );
}
