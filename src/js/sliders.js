// const heroSliderSpeed = 1500;

// const bodyStyles = window.getComputedStyle(document.body);
// const fooBar = bodyStyles.getPropertyValue("--hero-slider-speed"); //get

// document.body.style.setProperty("--hero-slider-speed", heroSliderSpeed + "ms"); //set

// const heroSlider = new Swiper(".hero-slider", {
//   slidesPerView: 1,
//   navigation: {
//     nextEl: ".hero-next",
//     prevEl: ".hero-prev",
//   },
//   speed: heroSliderSpeed,
//   autoplay: {
//     delay: 2500,
//   },
//   pagination: {
//     el: ".hero__pagination",
//     type: "bullets",
//     clickable: true,
//   },
//   on: {
//     init: function () {
//       const paginationBullets = document.querySelectorAll(
//         ".hero__pagination .swiper-pagination-bullet"
//       );

//       paginationBullets.forEach((el) => {
//         el.innerHTML = `<span class="hero__bar"></span>`;
//       });
//     },
//   },
// });

// Швидкість слайдера
// Швидкість слайдера
const heroSliderSpeed = 1500;
document.body.style.setProperty("--hero-slider-speed", heroSliderSpeed + "ms"); // Установка CSS-переменной

// Функция для добавления анимационных классов к активному слайду
function animateActiveSlide(swiper) {
  // Сначала удаляем классы анимации со всех элементов всех слайдов
  document
    .querySelectorAll(".swiper-slide .reveal-top, .swiper-slide .reveal-bottom")
    .forEach((el) => {
      el.classList.remove("reveal-top", "reveal-bottom");
    });

  // Находим активный слайд
  const activeSlide = swiper.slides[swiper.activeIndex];

  if (activeSlide) {
    // Находим анимируемые элементы внутри активного слайда
    const title = activeSlide.querySelector(".hero__title");
    const descr = activeSlide.querySelector(".hero__descr");
    const buttons = activeSlide.querySelector(".hero__buttons");

    // Добавляем анимационные классы с небольшой задержкой для последовательности
    if (title) setTimeout(() => title.classList.add("reveal-top"), 100);
    if (descr) setTimeout(() => descr.classList.add("reveal-bottom"), 300);
    if (buttons) setTimeout(() => buttons.classList.add("reveal-bottom"), 500);
  }
}

// Инициализация Swiper
window.onload = function () {
  const heroSlider = new Swiper(".hero-slider", {
    slidesPerView: 1,
    loop: true,
    navigation: {
      nextEl: ".hero-next",
      prevEl: ".hero-prev",
    },
    speed: heroSliderSpeed,
    // autoplay: {
    //   delay: 3500,
    //   disableOnInteraction: false,
    // },
    pagination: {
      el: ".hero__pagination",
      type: "bullets",
      clickable: true,
    },
    on: {
      init: function () {
        // Код для добавления спанов в пагинацию
        const paginationBullets = document.querySelectorAll(
          ".hero__pagination .swiper-pagination-bullet"
        );
        paginationBullets.forEach((el) => {
          el.innerHTML = `<span class="hero__bar"></span>`;
        });

        // Запускаем анимацию на первом слайде после инициализации
        animateActiveSlide(this);
      },
      // Добавляем обработчик события для повтора анимации
      slideChangeTransitionEnd: function () {
        animateActiveSlide(this);
      },
    },
  });
};

const portfolioSlider = new Swiper(".section__swiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  navigation: {
    nextEl: ".portfolio-section__next",
    prevEl: ".portfolio-section__prev",
  },
  breakpoints: {
    576: {
      slidesPerView: 2,
    },
    868: {
      slidesPerView: 3,
    },
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
console.log("✅ workInsideGalery найден:", workInsideGalery);

if (workInsideGalery) {
  const workSlider = new Swiper(".work-inside__slider-small", {
    spaceBetween: 5,
    slidesPerView: 6,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
      576: {
        slidesPerView: 6,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 10,
        spaceBetween: 20,
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
    on: {
      slideChange: function () {
        const activeSlide = this.slides[this.activeIndex];
        const img = activeSlide.querySelector(".work-inside__img");

        if (!img) return;

        // Выбираем направление по индексу
        const direction =
          this.activeIndex % 2 === 0 ? "img-expand-left" : "img-expand-right";

        // Функция запуска анимации безопасно
        function triggerAnimation(imgEl, className) {
          imgEl.classList.remove(
            "img-expand-left",
            "img-expand-right",
            "active"
          );
          imgEl.style.animation = "none"; // сброс анимации
          void imgEl.offsetWidth; // форс-рендер
          imgEl.classList.add(className, "active");
          imgEl.style.animation = ""; // включаем снова
        }

        // Если изображение уже загружено
        if (img.complete && img.naturalWidth !== 0) {
          triggerAnimation(img, direction);
        } else {
          // Подождём загрузку, прежде чем анимировать
          img.addEventListener("load", () => triggerAnimation(img, direction), {
            once: true,
          });
        }
      },
    },
  });

  // Начальная анимация для первого слайда
  const activeSlide = workInsideGalery.querySelector(".swiper-slide-active");
  const img = activeSlide?.querySelector(".work-inside__img");
  if (img) img.classList.add("img-expand-left");
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
