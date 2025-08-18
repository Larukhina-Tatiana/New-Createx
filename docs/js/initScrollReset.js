// Убирает «рывки» при переходе между страницами

// Предотвращает нежелательную прокрутку к якорям

// Даёт тебе полный контроль над scroll-поведением

function initScrollReset(options = {}) {
  const {
    behavior = "smooth", // 'auto' или 'smooth'
    restoreControl = true, // Отключить history.scrollRestoration отключить автоматическое восстановление scroll при переходе назад
    anchorCleanup = true, // Удалить #anchor из URL при загрузке
  } = options;

  document.addEventListener("DOMContentLoaded", () => {
    if (restoreControl && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    // Удаляет якорь из URL Если в URL есть #section, он удаляется

    // Это предотвращает автоматическую прокрутку к якорю при переходе между страницами
    if (anchorCleanup && location.hash) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    // Прокрутка к началу страницы

    // behavior: "smooth" делает её плавной
    window.scrollTo({ top: 0, behavior });
  });
}
// Автоматический вызов
initScrollReset();
