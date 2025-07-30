ScrollReveal({
  distance: "60px",
  duration: 1800,
  // reset: true,
});

document.querySelectorAll(".our-services__item").forEach((card, index) => {
  card.style.setProperty("--order", index);
});

function ScrollRevealFunc() {
  ScrollReveal().reveal(
    ".hero, .news-section, .page-hero, .page-hero__descr, .history, .team__descr, .clients__descr,  .projects",
    {
      origin: "bottom",
      // delay: 0,
      // viewOffset: { top: -100 },
    }
  );

  ScrollReveal().reveal(
    ".section__subtitle, .video, .section__title, .quotation, .team, .clients, .application-form, .reveal-top",
    {
      origin: "top",
    }
  );

  ScrollReveal().reveal(".section__text", {
    origin: "bottom",
    // duration: 2000,
  });

  // ScrollReveal().reveal(".hero__btn, .gift__btn", {
  //   origin: "top",
  //   duration: 6800,
  // });

  ScrollReveal().reveal(".rooms, .contacts__info", {
    origin: "top",
  });

  ScrollReveal().reveal(".rooms__title", {
    origin: "bottom",
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
