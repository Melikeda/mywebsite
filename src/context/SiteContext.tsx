import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "../content/site";

export type Theme = "light" | "dark";
export type ViewMode = "folio" | "flat";

const KEYS = {
  lang: "mell.lang",
  theme: "mell.theme",
  view: "mell.view",
} as const;

type SiteContextValue = {
  lang: Lang;
  theme: Theme;
  view: ViewMode;
  active: number;
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
  setView: (view: ViewMode) => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function readLang(): Lang {
  return document.documentElement.lang === "tr" ? "tr" : "en";
}

function readView(): ViewMode {
  return "folio";
}

function persist(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode */
  }
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang);
  const [theme, setThemeState] = useState<Theme>(readTheme);
  const [view, setViewState] = useState<ViewMode>(readView);
  const [active, setActive] = useState(0);

  useEffect(() => {
    document.documentElement.lang = lang;
    persist(KEYS.lang, lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    persist(KEYS.theme, theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", theme === "dark" ? "#14110e" : "#efe6d6");
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.view = "folio";
    persist(KEYS.view, "folio");
  }, [view]);

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-plate]"),
    );
    if (nodes.length === 0) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const next = Number(visible.target.getAttribute("data-plate"));
        if (Number.isFinite(next)) setActive(next);
      },
      { threshold: [0.35, 0.55, 0.75] },
    );

    for (const node of nodes) io.observe(node);
    return () => io.disconnect();
  }, [view]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const setView = useCallback((next: ViewMode) => setViewState(next), []);

  const value = useMemo(
    () => ({
      lang,
      theme,
      view,
      active,
      setLang,
      setTheme,
      setView,
    }),
    [lang, theme, view, active, setLang, setTheme, setView],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
