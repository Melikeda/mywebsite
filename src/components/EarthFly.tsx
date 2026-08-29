import { useCallback, useEffect, useRef, useState } from "react";
import { Map, Marker, type FlyToOptions, type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { pick, type Lang, type Localized } from "../content/site";
import { useSite } from "../context/SiteContext";

/** Mühendislik Fakültesi B Blok önü, Konuralp. */
const FACULTY: [number, number] = [31.18096, 40.90482];

const STYLE = {
  version: 8,
  sources: {
    imagery: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "Tiles © Esri — Earthstar Geographics",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "void",
      type: "background",
      paint: { "background-color": "#efe6d6" },
    },
    { id: "imagery", type: "raster", source: "imagery" },
  ],
  sky: {
    "atmosphere-blend": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      0.85,
      3,
      0.45,
      7,
      0.08,
      10,
      0,
    ],
  },
} satisfies StyleSpecification;

type Stage = "space" | "clouds" | "city" | "campus" | "photo";

const stageCopy: Record<Stage, Localized> = {
  space: { tr: "Dünya yörüngesi", en: "Earth orbit" },
  clouds: { tr: "Bulutların arasından", en: "Through the clouds" },
  city: { tr: "Düzce", en: "Düzce" },
  campus: { tr: "Mühendislik Fakültesi", en: "Faculty of Engineering" },
  photo: { tr: "Fakülte önü", en: "At the faculty" },
};

function flyTo(map: Map, options: FlyToOptions) {
  return new Promise<void>((resolve) => {
    map.once("moveend", () => resolve());
    map.flyTo({ essential: true, ...options });
  });
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function voidColor(theme: "light" | "dark") {
  return theme === "dark" ? "#14110e" : "#efe6d6";
}

export function EarthFly({
  lang,
  photo,
  photoAlt,
}: {
  lang: Lang;
  photo?: string;
  photoAlt?: string;
}) {
  const { theme } = useSite();
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const runId = useRef(0);
  const [stage, setStage] = useState<Stage>("space");

  const journey = useCallback(
    async (map: Map, id: number) => {
      const alive = () => id === runId.current && mapRef.current === map;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        map.jumpTo({ center: FACULTY, zoom: 18.1, pitch: 48, bearing: -12 });
        setStage(photo ? "photo" : "campus");
        return;
      }

      setStage("space");
      map.jumpTo({ center: [18, 14], zoom: 0.72, pitch: 0, bearing: 0 });
      await flyTo(map, { center: [28, 38], zoom: 2.2, duration: 1400, curve: 1.35 });
      if (!alive()) return;

      setStage("clouds");
      await flyTo(map, { center: FACULTY, zoom: 5.8, pitch: 16, duration: 1600, curve: 1.3 });
      if (!alive()) return;

      setStage("city");
      await flyTo(map, { center: FACULTY, zoom: 12, pitch: 36, bearing: -8, duration: 1300 });
      if (!alive()) return;

      setStage("campus");
      await flyTo(map, {
        center: FACULTY,
        zoom: 18.15,
        pitch: 52,
        bearing: -16,
        duration: 1500,
        curve: 1.15,
      });
      if (!alive() || !photo) return;

      await wait(220);
      if (!alive()) return;
      setStage("photo");
      await wait(4200);
      if (!alive()) return;
      setStage("space");
      await wait(900);
      if (!alive()) return;
      await journey(map, id);
    },
    [photo],
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const map = new Map({
      container: host,
      style: STYLE,
      center: [18, 14],
      zoom: 0.72,
      pitch: 0,
      bearing: 0,
      maxPitch: 75,
      cooperativeGestures: true,
      canvasContextAttributes: { alpha: true },
    });
    mapRef.current = map;
    let io: IntersectionObserver | undefined;

    map.on("load", () => {
      map.resize();
      try {
        map.setProjection({ type: "globe" });
      } catch {
        /* raster still flies if globe is unavailable */
      }
      map.setPaintProperty("void", "background-color", voidColor(theme));
      new Marker({ color: "#b34a2a" }).setLngLat(FACULTY).addTo(map);

      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          io?.disconnect();
          runId.current += 1;
          void journey(map, runId.current);
        },
        { threshold: 0.35 },
      );
      io.observe(host);
    });

    const onResize = () => map.resize();
    window.addEventListener("resize", onResize);

    return () => {
      runId.current += 1;
      io?.disconnect();
      window.removeEventListener("resize", onResize);
      mapRef.current = null;
      map.remove();
    };
  }, [journey]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.loaded()) return;
    try {
      map.setPaintProperty("void", "background-color", voidColor(theme));
    } catch {
      /* map style not ready */
    }
  }, [theme]);

  function replay() {
    const map = mapRef.current;
    if (!map) return;
    runId.current += 1;
    void journey(map, runId.current);
  }

  return (
    <figure className={`earth-fly is-${stage}`}>
      <div className="earth-fly__stage">
        <div ref={hostRef} className="earth-fly__map" />
        <div className="earth-fly__stars" aria-hidden="true" />
        <div className="earth-fly__veil" aria-hidden="true" />
        {photo ? (
          <img className="earth-fly__still" src={photo} alt={photoAlt ?? ""} />
        ) : null}
      </div>
      <figcaption className="earth-fly__caption">
        <span>{pick(lang, stageCopy[stage])}</span>
        <button type="button" onClick={replay}>
          {pick(lang, { tr: "Yeniden uç", en: "Fly again" })}
        </button>
      </figcaption>
    </figure>
  );
}
