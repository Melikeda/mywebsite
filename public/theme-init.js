(() => {
  try {
    const theme = localStorage.getItem("mell.theme");
    const lang = localStorage.getItem("mell.lang");
    const root = document.documentElement;
    root.dataset.theme = theme === "dark" ? "dark" : "light";
    root.lang = lang === "tr" ? "tr" : "en";
    root.dataset.view = "folio";
  } catch {
    /* ignore */
  }
})();
