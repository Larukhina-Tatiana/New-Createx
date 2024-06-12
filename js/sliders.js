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
