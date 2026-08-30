(() => {
  try {
    const theme = localStorage.getItem("mell.theme");
    const lang = localStorage.getItem("mell.lang");
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
    root.dataset.view = "folio";
  } catch {
    /* ignore */
  }
})();
