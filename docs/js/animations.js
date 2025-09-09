// 🎬 Главный объект, управляющий всеми анимациями на странице
const Animations = {
  // Проверка на предпочтение пользователя: отключить анимации, если включён режим "reduce motion"
  prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches,

  // 🚀 Инициализация всех анимаций после полной загрузки DOM
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initShakeLoop(); // Анимация тряски
      this.initAppearance(); // Анимация появления
      this.init3DTilt(); // 3D наклон при движении мыши
    });
  },

  // 🔁 Анимация тряски элементов с классом .shake
  initShakeLoop() {
    const elements = document.querySelectorAll(".animate-on-scroll");

    // Запускаем бесконечную тряску для элемента
    const setupShakeLoop = (el) => {
      if (this.prefersReducedMotion || el.dataset.shaking === "true") return;

      el.dataset.shaking = "true";

      // Устанавливаем интервал тряски
      const intervalId = setInterval(() => {
        el.classList.add("shake-loop");
        setTimeout(() => el.classList.remove("shake-loop"), 1200); // длительность тряски
      }, 3000); // интервал между трясками

      el.dataset.shakeInterval = intervalId;
    };

    // Останавливаем тряску и очищаем данные
    const clearShakeLoop = (el) => {
      const id = el.dataset.shakeInterval;
      if (id) clearInterval(id);
      delete el.dataset.shakeInterval;
      delete el.dataset.shaking;
      el.classList.remove("shake-loop");
    };

    // Обработка появления/исчезновения элемента в зоне видимости
    const handleVisibilityChange = (el, isVisible) => {
      const isShake = el.classList.contains("shake");

      if (isVisible) {
        el.classList.add("in-view");
        if (isShake) setupShakeLoop(el);
      } else {
        el.classList.remove("in-view");
        if (isShake) clearShakeLoop(el);
      }
    };

    // Используем IntersectionObserver, если доступен
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            handleVisibilityChange(entry.target, entry.isIntersecting);
          });
        },
        { threshold: 0.2 } // элемент считается видимым, если 20% его площади в viewport
      );

      elements.forEach((el) => observer.observe(el));
    } else {
      // 🔙 Фолбэк для старых браузеров
      const fallbackCheckVisibility = () => {
        elements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const visible = rect.top <= window.innerHeight && rect.bottom >= 0;
          handleVisibilityChange(el, visible);
        });
      };

      window.addEventListener("scroll", fallbackCheckVisibility);
      window.addEventListener("resize", fallbackCheckVisibility);
      fallbackCheckVisibility(); // первичная проверка
    }
  },

  // ✨ Анимация появления элементов с классами типа appearance-*
  initAppearance() {
    let appearanceEls = [
      ...document.querySelectorAll("[class*='appearance-']"),
    ];

    // Наблюдатель за появлением элементов в зоне видимости
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const animateType = el.dataset.animate;
          const delayAttr = el.dataset.delay;
          const index = appearanceEls.indexOf(el);

          if (entry.isIntersecting) {
            // Вычисляем задержку анимации
            let delay = 0;
            if (animateType === "sync") delay = 0;
            else if (animateType === "chain") delay = 0.2 + index * 0.3;
            else if (animateType === "delay" && delayAttr)
              delay = parseFloat(delayAttr);

            // Устанавливаем задержку и запускаем анимацию
            el.style.animationDelay = `${delay}s`;
            el.classList.add("visible");

            // Если цепная анимация — запускаем следующий элемент после завершения текущего
            if (animateType === "chain") {
              el.addEventListener(
                "animationend",
                () => {
                  const nextEl = appearanceEls[index + 1];
                  if (nextEl && !nextEl.classList.contains("visible")) {
                    nextEl.classList.add("visible");
                  }
                },
                { once: true }
              );
            }
          } else {
            // Сброс анимации при выходе из зоны видимости
            el.classList.remove("visible");
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px", // смещение нижней границы viewport
      }
    );

    // Запускаем наблюдение за всеми элементами
    const observeAll = () => {
      appearanceEls.forEach((el) => observer.observe(el));
    };

    observeAll();

    // При изменении размеров окна — пересобираем список и запускаем наблюдение заново
    window.addEventListener("resize", () => {
      appearanceEls = [...document.querySelectorAll("[class*='appearance-']")];
      observeAll();
    });
  },

  // 🌀 3D наклон блока при движении мыши
  init3DTilt() {
    const container = document.getElementById("js-container");
    const inner = document.getElementById("js-inner");

    // Если нужные элементы отсутствуют — выходим
    if (!container || !inner) return;

    // Объект для отслеживания положения мыши
    const mouse = {
      _x: 0,
      _y: 0,
      x: 0,
      y: 0,

      // Обновляем координаты мыши относительно центра контейнера
      updatePosition(event) {
        this.x = event.clientX - this._x;
        this.y = (event.clientY - this._y) * -1;
      },

      // Устанавливаем точку отсчёта — центр контейнера
      setOrigin(el) {
        const rect = el.getBoundingClientRect();
        this._x = rect.left + rect.width / 2;
        this._y = rect.top + rect.height / 2;
      },
    };

    mouse.setOrigin(container);

    let counter = 0;
    const updateRate = 10;

    // Проверка, пора ли обновлять анимацию (для оптимизации)
    const isTimeToUpdate = () => counter++ % updateRate === 0;

    // Обновляем стиль трансформации
    const update = (event) => {
      mouse.updatePosition(event);
      const x = (mouse.y / inner.offsetHeight / 2).toFixed(2);
      const y = (mouse.x / inner.offsetWidth / 2).toFixed(2);
      inner.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
    };

    // Навешиваем обработчики событий мыши
    container.addEventListener("mouseenter", update);
    container.addEventListener("mouseleave", () => (inner.style = ""));
    container.addEventListener("mousemove", (event) => {
      if (isTimeToUpdate()) update(event);
    });
  },
};

// 🔧 Запускаем модуль анимаций
Animations.init();
