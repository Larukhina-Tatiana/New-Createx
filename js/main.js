$(".hero__slider").slick({
  infinite: true,
  fade: true,
  dots: true,
  nextArrow:
    '<button class="slick-arrow slick-next" aria-label="Next"><img src="../images/icons/hero-arrow-next.svg" alt="Next arrow"></button>',
  prevArrow:
    '<button class="slick-arrow slick-prev" aria-label="Previous"><img src="../images/icons/hero-arrow-prev.svg" alt="Previous arrow"></button>',
  // asNavFor: ".slider-dots",
});

// $(".slider-dots").slick({
//   arrows: false,
//   slidesToShow: 4,
//   slidesTOScroll: 1,
//   asNavFor: ".hero__slider",
// });
