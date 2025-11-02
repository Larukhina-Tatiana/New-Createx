if (document.querySelector('a[href*="work.html"][data-tab]')) {
  document
    .querySelectorAll('a[href*="work.html"][data-tab]')
    .forEach((link) => {
      link.addEventListener("click", () => {
        const tab = link.dataset.tab;
        if (tab) {
          sessionStorage.setItem("tab", tab);
        }
      });
    });
}
