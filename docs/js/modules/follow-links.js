document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const filter = params.get("filter");

  if (filter) {
    const targetBtn = document.querySelector(`[data-filter=".${filter}"]`);
    if (targetBtn) {
      targetBtn.click(); // активирует таб или фильтр
    }
  }
});
