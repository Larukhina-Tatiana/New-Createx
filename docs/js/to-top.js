/**
 * Инициализирует кнопку "Наверх" (to-top).
 *
 * - Определяет высоту hero-блока для расчета точки появления кнопки.
 * - Показывает/скрывает кнопку в зависимости от положения скролла.
 * - Обеспечивает плавную прокрутку наверх при клике.
 * - Адаптируется к изменению размера окна.
 */
const initToTopButton = () => {
  const toTop = document.querySelector(".to-top");

  // Если кнопка не найдена, выходим из функции
  if (!toTop) {
    console.warn('Элемент с классом "to-top" не найден.');
    return;
  }

  // Переменная для высоты hero-блока
  let heroHeight = 0;

  // Находим hero-блоки
  const heroElement = document.querySelector(".hero");
  const pageHeroElement = document.querySelector(".page-hero");

  /**
   * Рассчитывает и устанавливает высоту hero-блока.
   * Это нужно, чтобы кнопка "Наверх" появлялась после прокрутки этого блока.
   */
  const setHeroHeight = () => {
    if (heroElement) {
      heroHeight = heroElement.offsetHeight;
    } else if (pageHeroElement) {
      heroHeight = pageHeroElement.offsetHeight;
    }
  };

  /**
   * Управляет видимостью кнопки "Наверх".
   * @param {number} scrollY - Текущая позиция скролла по вертикали.
   */
  const handleScroll = (scrollY = 0) => {
    if (scrollY >= heroHeight && heroHeight > 0) {
      toTop.classList.add("to-top--active");
    } else {
      toTop.classList.remove("to-top--active");
    }
  };

  /**
   * Обработчик клика по кнопке "Наверх".
   * @param {Event} event - Событие клика.
   */
  const handleTopClick = (event) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /**
   * Обработчик изменения размера окна.
   * Пересчитывает высоту hero-блока и обновляет видимость кнопки.
   */
  const handleResize = () => {
    setHeroHeight();
    handleScroll(window.scrollY);
  };

  // --- Инициализация ---

  // Устанавливаем начальную высоту hero-блока
  setHeroHeight();
  // Проверяем видимость кнопки при начальной загрузке
  handleScroll(window.scrollY);

  // --- Добавление обработчиков событий ---

  // Скролл страницы
  window.addEventListener("scroll", () => handleScroll(window.scrollY));
  // Изменение размера окна
  window.addEventListener("resize", handleResize);
  // Клик по кнопке
  toTop.addEventListener("click", handleTopClick);
};

// Запускаем всю логику только после полной загрузки DOM
document.addEventListener("DOMContentLoaded", initToTopButton);
