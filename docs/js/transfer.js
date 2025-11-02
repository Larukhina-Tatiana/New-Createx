window.addEventListener("DOMContentLoaded", () => {
  const address = document.querySelector(".header__address");
  const nav = document.querySelector(".header__nav");

  //   // Перемещение элементов в мобильное меню
  if (address && nav) {
    new TransferElements({
      sourceElement: address,
      breakpoints: {
        578: {
          targetElement: nav,
          targetPosition: 1,
        },
      },
    });
  }
});
