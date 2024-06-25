const heroSliderSpeed = 1500;

const bodyStyles = window.getComputedStyle(document.body);
const fooBar = bodyStyles.getPropertyValue("--hero-slider-speed"); //get

document.body.style.setProperty("--hero-slider-speed", heroSliderSpeed + "ms"); //set

const heroSlider = new Swiper(".hero-slider", {
  slidesPerView: 1,
  navigation: {
    nextEl: ".hero-next",
    prevEl: ".hero-prev",
  },
  speed: heroSliderSpeed,
  // autoplay: {
  //   delay: 1000,
  // },
  pagination: {
    el: ".hero__pagination",
    type: "bullets",
    clickable: true,
  },
  on: {
    init: function () {
      const paginationBullets = document.querySelectorAll(
        ".hero__pagination .swiper-pagination-bullet"
      );

      paginationBullets.forEach((el) => {
        el.innerHTML = `<span class="hero__bar"></span>`;
      });
    },
  },
});

const portfolioSlider = new Swiper(".section__swiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  loop: true,
  navigation: {
    nextEl: ".portfolio-section__next",
    prevEl: ".portfolio-section__prev",
  },
});

const testimonialsSlider = new Swiper(".testimonials__swiper", {
  slidesPerView: 1,
  // spaceBetween: 30,
  loop: true,
  navigation: {
    nextEl: ".testimonials__next",
    prevEl: ".testimonials__prev",
  },
});

const workInsideGalery = document.querySelector(".work-inside__slider-big");

if (workInsideGalery) {
  const workSlider = new Swiper(".work-inside__slider-small", {
    spaceBetween: 20,
    slidesPerView: 10,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
      576: {
        slidesPerView: 6,
      },
      768: {
        slidesPerView: 10,
      },
    },
  });
  const workSlidesNav = new Swiper(workInsideGalery, {
    spaceBetween: 20,
    slidesPerView: 1,
    navigation: {
      nextEl: ".work-inside__btn--next",
      prevEl: ".work-inside__btn--prev",
    },
    thumbs: {
      swiper: workSlider,
    },
  });
}

const historySlider = document.querySelector(".history__slider-images");

if (historySlider) {
  const workSlider = new Swiper(historySlider, {
    spaceBetween: 20,
    slidesPerView: 1,
    navigation: {
      nextEl: ".history__next",
      prevEl: ".history__prev",
    },
  });

  workSlider.on("slideChange", function () {
    console.log(workSlider.realIndex);

    historyBtns.forEach((el) => {
      el.classList.remove("history-nav__btn--active");
    });

    document
      .querySelector(`.history-nav__btn[data-index="${workSlider.realIndex}"]`)
      .classList.add("history-nav__btn--active");
  });

  const historyBtns = document.querySelectorAll(".history-nav__btn");

  historyBtns.forEach((el, idx) => {
    el.setAttribute("data-index", idx);

    el.addEventListener("click", (e) => {
      const index = e.currentTarget.dataset.index;

      historyBtns.forEach((el) => {
        el.classList.remove("history-nav__btn--active");
      });

      e.currentTarget.classList.add("history-nav__btn--active");

      workSlider.slideTo(index);
    });
  });
}
