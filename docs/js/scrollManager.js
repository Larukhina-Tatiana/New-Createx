(function () {
  // Устанавливаем флаг при клике на ссылку
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (href && href.includes("work.html")) {
      sessionStorage.setItem("scrollToTop", "true");
    }
  });
})();
