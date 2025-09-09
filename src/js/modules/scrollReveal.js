(function () {
  const sr = ScrollReveal({
    distance: "30px",
    duration: 800,
    easing: "ease-out",
    reset: true,
    viewOffset: { top: 100, bottom: 50 },
  });

  function revealCommon() {
    sr.reveal(".section__title, .reveal-top", { origin: "top", delay: 100 });
    sr.reveal(".reveal-bottom", { origin: "bottom", delay: 100 });
    sr.reveal(".reveal-left", { origin: "left", delay: 200 });
    sr.reveal(".reveal-right", { origin: "right", delay: 200 });
    sr.reveal(".reveal-rotate", {
      origin: "right",
      duration: 300,
      delay: 200,
      easing: "ease-in-out",
      rotate: { x: 500, y: 500 },
      scale: 0.5,
    });
  }

  function revealHomePage() {
    sr.reveal(".page-hero", { origin: "bottom", delay: 100 });
    sr.reveal(".categories__box, .page-hero__descr", {
      origin: "bottom",
      delay: 200,
    });
    sr.reveal(".quotation", { origin: "top", delay: 200 });
    // Установка кастомного порядка
    document
      .querySelectorAll(".our-services__item, .offices__nav-coll")
      .forEach((card, index) => {
        card.style.setProperty("--order", index);
      });

    // Поочерёдная анимация карточек с чередованием направления
    const cards = document.querySelectorAll(".our-services__item");

    cards.forEach((card, index) => {
      const isEven = index % 2 === 0;

      sr.reveal(card, {
        origin: isEven ? "top" : "bottom",
        distance: "20px",
        duration: 400,
        opacity: 0,
        delay: index * 350,
        easing: "ease-in-out",
        cleanup: true,
      });
    });
  }

  function revealWorkPage() {
    sr.reveal(".projects__title", {
      origin: "top",
      delay: 100,
    });

    sr.reveal(".testimonial", { origin: "bottom", delay: 200 });
  }

  function initScrollReveal() {
    revealCommon();

    const bodyClass = document.body.classList;

    if (bodyClass.contains("page-home")) {
      revealHomePage();
    }

    if (bodyClass.contains("page-work")) {
      revealWorkPage();
    }

    // Добавляй другие страницы по мере необходимости
  }

  document.addEventListener("DOMContentLoaded", initScrollReveal);
})();
