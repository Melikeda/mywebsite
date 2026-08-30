import { useEffect, useState } from "react";
import { pick, type Localized } from "../content/site";
import { useSite } from "../context/SiteContext";

const HOLD_MS = 2800;

const REELS: { src: string; label: Localized }[] = [
  {
    src: "/projects/yolo/home.png",
    label: { tr: "Hızlı ilaç tarama", en: "Quick medicine scan" },
  },
  {
    src: "/projects/yolo/preview.png",
    label: { tr: "Önizleme", en: "Preview" },
  },
  {
    src: "/projects/yolo/result-photo.png",
    label: { tr: "Analiz sonucu", en: "Analysis result" },
  },
  {
    src: "/projects/yolo/qr.png",
    label: { tr: "Barkod tara", en: "Scan barcode" },
  },
  {
    src: "/projects/yolo/result-qr.png",
    label: { tr: "Barkod sonucu", en: "Barcode result" },
  },
  {
    src: "/projects/yolo/history.png",
    label: { tr: "Tarama geçmişi", en: "Scan history" },
  },
];

export function YoloPhone() {
  const { lang } = useSite();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;
    const id = window.setInterval(() => {
      setStep((current) => (current + 1) % REELS.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <figure className="phone" data-step={step} aria-label={pick(lang, REELS[step].label)}>
      <div className="phone__stage">
        <div className="phone__bezel">
          <span className="phone__edge" aria-hidden="true" />
          <span className="phone__notch" />
          <div className="phone__screen" aria-live="polite">
            {REELS.map((reel, index) => (
              <img
                key={reel.src}
                className={`yolo-shot${index === step ? " is-on" : ""}`}
                src={reel.src}
                alt={pick(lang, reel.label)}
                aria-hidden={index !== step}
              />
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
