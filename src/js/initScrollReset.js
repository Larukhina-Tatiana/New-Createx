function initScrollReset(options = {}) {
  const {
    behavior = "smooth", // 'auto' или 'smooth'
    restoreControl = true, // Отключить history.scrollRestoration
    anchorCleanup = true, // Удалить #anchor из URL при загрузке
  } = options;

  document.addEventListener("DOMContentLoaded", () => {
    if (restoreControl && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    if (anchorCleanup && location.hash) {
      history.replaceState(null, "", location.pathname + location.search);
    }

    window.scrollTo({ top: 0, behavior });
  });
}
// Автоматический вызов
initScrollReset();
