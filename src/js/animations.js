// Ждём полной загрузки DOM
document.addEventListener("DOMContentLoaded", function () {
  // Контейнер, относительно которого будет работать IntersectionObserver (если нужен)
  const content = document.querySelector(".scroll-content");
  const shakeDuration = 1200;
  const shakeInterval = 3000;

  // Создаём наблюдатель за появлением элементов в зоне видимости
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const isShake = el.classList.contains("shake"); // Проверяем, нужен ли shake

        if (entry.isIntersecting) {
          // Элемент появился в зоне видимости
          el.classList.add("in-view");
          if (isShake) setupShakeLoop(el); // Запускаем shake-анимацию
        } else {
          // Элемент вышел из зоны видимости
          el.classList.remove("in-view");
          if (isShake) clearShakeLoop(el); // Останавливаем shake-анимацию
        }
      });
    },
    {
      root: content, // Можно указать null, если нужен весь viewport
      threshold: 0.2, // Срабатывает, когда 20% элемента видно
    }
  );

  // Функция запускает shake-анимацию с интервалом
  function setupShakeLoop(el) {
    function setupShakeLoop(el) {
      // ⛳ Уважение к системным настройкам
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) {
        console.log("🛑 Shake отключён: prefers-reduced-motion включён");
        return;
      }

      if (el.dataset.shaking === "true") return; // если уже запущено — ничего не делаем
      el.dataset.shaking = "true";

      const intervalId = setInterval(() => {
        el.classList.add("shake-loop");
        setTimeout(() => el.classList.remove("shake-loop"), shakeDuration);
      }, shakeInterval);

      el.dataset.shakeInterval = intervalId;
    }
    // Сначала очищаем предыдущий интервал, если он есть
    const existingId = el.dataset.shakeInterval;
    if (existingId) {
      clearInterval(existingId);
    }

    if (el.dataset.shaking === "true") return; // Если уже запущено — ничего не делаем
    el.dataset.shaking = "true"; // Ставим маркер

    // Запускаем интервал для анимации shake
    const intervalId = setInterval(() => {
      el.classList.add("shake-loop");
      setTimeout(() => el.classList.remove("shake-loop"), shakeDuration); // Убираем класс через 1.2 сек (длительность анимации)
    }, shakeInterval); // Каждые 3 секунды

    el.dataset.shakeInterval = intervalId; // Сохраняем id интервала для последующей очистки
  }

  // Функция останавливает shake-анимацию и очищает интервал
  function clearShakeLoop(el) {
    const id = el.dataset.shakeInterval;
    if (id) clearInterval(id); // Очищаем интервал, если был
    delete el.dataset.shakeInterval; // Удаляем data-атрибут
    delete el.dataset.shaking; // Удаляем маркер
    el.classList.remove("shake-loop"); // На всякий случай убираем класс
  }

  // Подключаем наблюдатель ко всем элементам с классом .animate-on-scroll
  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observer.observe(el);
  });
});
