const scroll = new SmoothScroll(".to-top");
const toTop = document.querySelector(".to-top");
if (!toTop) {
  console.warn('Element with class "to-top" не обнаружен.');
} else {
  let heroHeight;

  if (document.querySelector(".hero")) {
    heroHeight = document.querySelector(".hero").offsetHeight;
  }

  if (document.querySelector(".page-hero")) {
    heroHeight = document.querySelector(".page-hero").offsetHeight;
  }

  const isVisibleToTop = (y = 0) => {
    if (y >= heroHeight) {
      toTop.classList.add("to-top--active");
    } else {
      toTop.classList.remove("to-top--active");
    }
  };

  isVisibleToTop(window.scrollY);

  window.addEventListener("scroll", () => {
    let y = window.scrollY;
    isVisibleToTop(y);
  });
}
