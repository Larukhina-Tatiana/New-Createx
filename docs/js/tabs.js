(function () {
  // 🔧 Константы
  const maxItems = 6; // Количество карточек, отображаемых при первом показе
  let currentStep = 1; // Шаг для кнопки "Показать больше"

  // 🔗 Элементы интерфейса
  const portfolioTabsNav = document.querySelector(".portfolio-tabs-nav");
  const portfolioTabsBtns = document.querySelectorAll(
    ".portfolio-tabs-nav__btn"
  );
  const loadMore = document.querySelector(".portfolio-more");

  /**
   * Отображает карточки для выбранной вкладки.
   * Показывает первые maxItems, остальные скрывает.
   * Управляет видимостью кнопки "Показать больше".
   *
   * @param {string} path - значение data-path активной вкладки
   */
  function renderTabItems(path) {
    const allItems = document.querySelectorAll(".tabs-content__item");

    const itemsToShow =
      path === "all"
        ? Array.from(allItems)
        : Array.from(document.querySelectorAll(`[data-target="${path}"]`))
            .map((el) => el.closest(".tabs-content__item"))
            .filter(Boolean);

    // Скрываем все карточки
    allItems.forEach((item) => {
      item.classList.remove("item--visible");
      item.classList.add("item--hidden");
      item.style.display = "none";
    });

    // Показываем первые maxItems
    itemsToShow.slice(0, maxItems).forEach((item) => {
      item.style.display = "block";
      requestAnimationFrame(() => {
        item.classList.remove("item--hidden");
        item.classList.add("item--visible");
      });
    });

    // Управляем кнопкой "Показать больше"
    if (loadMore) {
      loadMore.style.display =
        itemsToShow.length > maxItems ? "inline-flex" : "none";
    }
  }

  /**
   * Активирует вкладку, обновляет UI и запускает отображение карточек.
   * При необходимости прокручивает к началу контента.
   *
   * @param {string} path - значение data-path вкладки
   * @param {boolean} scroll - нужно ли прокручивать к карточкам
   */
  function activateTab(path, scroll = true) {
    console.log(`▶️ Активируем вкладку: ${path}`);
    currentStep = 1;

    // Прокрутка к началу карточек
    if (scroll) {
      const cardsWrapper = document.querySelector(".tabs-content");
      const tabsWrapper = document.querySelector(".portfolio-tabs-nav");

      if (cardsWrapper) {
        const headerHeight =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--header-height"
            )
          ) || 0;

        const tabsHeight = tabsWrapper?.offsetHeight || 0;
        const totalOffset = headerHeight + tabsHeight;

        const top =
          cardsWrapper.getBoundingClientRect().top +
          window.scrollY -
          totalOffset;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      }
    }

    // Обновляем активную кнопку
    const targetBtn = document.querySelector(
      `.portfolio-tabs-nav__btn[data-path="${path}"]`
    );
    if (!targetBtn) return;

    portfolioTabsBtns.forEach((btn) =>
      btn.classList.remove("portfolio-tabs-nav__btn--active")
    );
    targetBtn.classList.add("portfolio-tabs-nav__btn--active");

    // Отображаем карточки
    renderTabItems(path);
  }

  /**
   * Инициализация вкладки при загрузке страницы.
   * Считывает значение из URL: #hash, ?tab=..., sessionStorage.
   * Повторяет попытки, если карточки ещё не загружены.
   */
  function initTabFromURL() {
    let hash = window.location.hash.replace("#", "");
    // console.log("▶️ initTabFromURL: hash =", hash);
    // console.log("window.location.search =", window.location.search);
    // console.log("window.location.hash =", window.location.hash);

    if (!hash) {
      hash = new URLSearchParams(window.location.search).get("tab");
    }
    if (!hash) {
      hash = sessionStorage.getItem("tab");
      sessionStorage.removeItem("tab");
    }

    if (!hash) {
      activateTab("all", false); // Без прокрутки при обычной загрузке
      return;
    }

    let attempts = 0;
    const maxAttempts = 30;

    const check = () => {
      const btn = document.querySelector(
        `.portfolio-tabs-nav__btn[data-path="${hash}"]`
      );
      const items = document.querySelectorAll(`[data-target="${hash}"]`);
      if (btn && items.length > 0) {
        activateTab(hash, true); // Прокрутка при переходе с другой страницы
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(check, 100);
      } else {
        console.warn(`❌ Вкладка "${hash}" не найдена — не активируем "all"`);
      }
    };

    check();
  }

  /**
   * Обработчик кнопки "Показать больше".
   * Показывает следующую порцию карточек по текущей вкладке.
   */
  if (loadMore) {
    loadMore.addEventListener("click", () => {
      const activePath = document.querySelector(
        ".portfolio-tabs-nav__btn--active"
      )?.dataset.path;
      if (!activePath) return;

      const allItems =
        activePath === "all"
          ? Array.from(document.querySelectorAll(".tabs-content__item"))
          : Array.from(
              document.querySelectorAll(`[data-target="${activePath}"]`)
            )
              .map((el) => el.closest(".tabs-content__item"))
              .filter(Boolean);

      const start = currentStep * maxItems;
      const end = start + maxItems;
      const nextItems = allItems.slice(start, end);

      nextItems.forEach((item, index) => {
        item.style.display = "block";
        setTimeout(() => {
          item.classList.remove("item--hidden");
          item.classList.add("item--visible");
        }, index * 100);
      });

      currentStep++;

      if (end >= allItems.length) {
        loadMore.style.display = "none";
      }
    });
  }

  /**
   * Обработчик клика по вкладкам.
   * Активирует соответствующую вкладку и обновляет URL.
   */
  if (portfolioTabsNav) {
    portfolioTabsNav.addEventListener("click", (e) => {
      const target = e.target.closest(".portfolio-tabs-nav__btn");
      if (target) {
        activateTab(target.dataset.path);
        history.pushState(null, "", `#${target.dataset.path}`);
      }
    });
  }

  // 🔁 Обработка переходов назад/вперёд
  window.addEventListener("popstate", () => {
    console.log("🔄 popstate: проверяем хеш");
    initTabFromURL();
  });

  // 📤 Экспортируем глобально
  window.initTabs = () => {}; // если нужно, можно оставить пустым
  window.initTabFromURL = initTabFromURL;
})();
