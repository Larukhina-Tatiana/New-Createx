const toTop = document.querySelector(".to-top");

// Перевіряємо, чи існує елемент
if (!toTop) {
  console.warn('Елемент з класом "to-top" не знайдено.');
} else {
  // Змінна для зберігання висоти 'hero' блоку
  let heroHeight = 0;

  // Знаходимо елементи, що визначають висоту прокручування
  const heroElement = document.querySelector(".hero");
  const pageHeroElement = document.querySelector(".page-hero");

  // Встановлюємо висоту 'heroHeight'
  if (heroElement) {
    heroHeight = heroElement.offsetHeight;
  } else if (pageHeroElement) {
    heroHeight = pageHeroElement.offsetHeight;
  }

  // Функція для перевірки видимості кнопки
  const isVisibleToTop = (y = 0) => {
    if (y >= heroHeight) {
      toTop.classList.add("to-top--active");
    } else {
      toTop.classList.remove("to-top--active");
    }
  };

  // Початкова перевірка при завантаженні сторінки
  isVisibleToTop(window.scrollY);

  // Обробник події скролу для оновлення видимості кнопки
  window.addEventListener("scroll", () => {
    let y = window.scrollY;
    isVisibleToTop(y);
  });

  // --- Нова логіка для обробки кліка ---
  // Додаємо обробник події click на кнопку
  toTop.addEventListener("click", (event) => {
    // Зупиняємо стандартну поведінку посилання, щоб не було переходу
    event.preventDefault();

    // Виконуємо плавне прокручування до верху сторінки
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
