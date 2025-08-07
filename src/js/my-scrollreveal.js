ScrollReveal({
  distance: "60px",
  duration: 1000,
  reset: true, // повторение анимации
});

document
  .querySelectorAll(".our-services__item, .offices__nav-coll")
  .forEach((card, index) => {
    card.style.setProperty("--order", index);
  });

function ScrollRevealFunc() {
  ScrollReveal().reveal(
    ".news-section, .page-hero, .page-hero__descr, .history, .team__descr, .clients__descr,  .projects, .categories__box, .reveal-bottom",
    {
      origin: "bottom",
      // delay: 0,
      // viewOffset: { top: -100 },
    }
  );
  ScrollReveal().reveal(".quotation, .team, .reveal-top", {
    origin: "top",
    delay: 200,
    // viewOffset: { top: -100 },
  });

  ScrollReveal().reveal(".reveal-bottom", {
    origin: "bottom",
    // duration: 2000,
  });
  ScrollReveal().reveal(".offices__nav-coll", {
    origin: "bottom",
    duration: 2000,
  });

  // ScrollReveal().reveal(".hero__btn, .gift__btn", {
  //   origin: "top",
  //   duration: 6800,
  // });

  ScrollReveal().reveal(".rooms, .contacts__info", {
    origin: "top",
  });

  ScrollReveal().reveal(".reveal-left", {
    origin: "left",
    delay: 200,
  });
  ScrollReveal().reveal(".reveal-right", {
    origin: "right",
    delay: 200,
  });

  ScrollReveal().reveal(".reveal-rotate", {
    origin: "right",
    // distance: "550px",
    duration: 300,
    delay: 200,
    easing: "ease-in-out",
    // reset: false,
    rotate: {
      x: 500,
      y: 500,
    },
    scale: 0.5,
  });

  // ScrollReveal().reveal(".satisfied, .hero__product", {
  //   origin: "left",
  // });

  const cards = document.querySelectorAll(".our-services__item");

  cards.forEach((card, index) => {
    const isEven = index % 2 === 0;

    ScrollReveal().reveal(card, {
      origin: isEven ? "top" : "bottom",
      distance: "20px",
      duration: 400,
      opacity: 0,
      delay: index * 350, // поочерёдный эффект
      easing: "ease-in-out",
      cleanup: true, // чтобы не пересоздавал каждый раз
    });
  });
}

ScrollRevealFunc();
