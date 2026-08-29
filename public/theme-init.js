(() => {
  try {
    const theme = localStorage.getItem("mell.theme");
    const lang = localStorage.getItem("mell.lang");
    const view = localStorage.getItem("mell.view");
    const root = document.documentElement;
    if (theme === "dark" || theme === "light") {
      root.dataset.theme = theme;
    } else {
      root.dataset.theme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
    }
    root.lang = lang === "en" ? "en" : "tr";
    if (view === "flat" || view === "folio") root.dataset.view = view;
  } catch {
    /* ignore */
  }
})();
