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
