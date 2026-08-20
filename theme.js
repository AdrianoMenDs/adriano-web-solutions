(function () {
  const storageKey = "amendes-theme";
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function savedTheme() {
    try {
      const value = localStorage.getItem(storageKey);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  }

  function updateButtons() {
    const isDark = root.dataset.theme === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const nextTheme = isDark ? "claro" : "escuro";
      button.setAttribute("aria-label", `Ativar modo ${nextTheme}`);
      button.setAttribute("title", `Ativar modo ${nextTheme}`);
      const icon = button.querySelector("[data-theme-icon]");
      if (icon) icon.textContent = isDark ? "☀" : "☾";
    });
  }

  applyTheme(savedTheme() || (media.matches ? "dark" : "light"));

  document.addEventListener("DOMContentLoaded", () => {
    updateButtons();
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        try {
          localStorage.setItem(storageKey, nextTheme);
        } catch {}
        updateButtons();
      });
    });
  });

  media.addEventListener("change", (event) => {
    if (!savedTheme()) {
      applyTheme(event.matches ? "dark" : "light");
      updateButtons();
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey && (event.newValue === "light" || event.newValue === "dark")) {
      applyTheme(event.newValue);
      updateButtons();
    }
  });
})();
