document.addEventListener("DOMContentLoaded", () => {
  // console.log("✅ tabs.js загружен");

  const portfolioTabsNav = document.querySelector(".portfolio-tabs-nav");
  const portfolioTabsBtns = document.querySelectorAll(
    ".portfolio-tabs-nav__btn"
  );
  const portfolioTabsItems = document.querySelectorAll(".tabs-content__item");
  const loadMore = document.querySelector(".portfolio-more");
  const maxItems = 9;

  // Функция для добавления/удаления классов анимации
  const setItemVisibility = (item, isVisible) => {
    if (isVisible) {
      item.classList.remove("item--hidden");
      item.classList.add("item--visible");
    } else {
      item.classList.remove("item--visible");
      item.classList.add("item--hidden");
    }
  };

  // Активация вкладки по path
  // const activateTab = (path) => {
  //   console.log(`▶️ Активируем вкладку: ${path}`);
  //   const targetBtn = document.querySelector(
  //     `.portfolio-tabs-nav__btn[data-path="${path}"]`
  //   );
  //   if (!targetBtn) return;

  //   // Обновляем активную кнопку
  //   portfolioTabsBtns.forEach((btn) =>
  //     btn.classList.remove("portfolio-tabs-nav__btn--active")
  //   );
  //   targetBtn.classList.add("portfolio-tabs-nav__btn--active");

  //   // Получаем нужные элементы
  //   const itemsToShow =
  //     path === "all"
  //       ? Array.from(portfolioTabsItems)
  //       : Array.from(document.querySelectorAll(`[data-target="${path}"]`))
  //           .map((el) => el.closest(".tabs-content__item"))
  //           .filter(Boolean);

  //   // Скрываем все элементы
  //   portfolioTabsItems.forEach((item) => {
  //     item.classList.remove("item--visible");
  //     item.classList.add("item--hidden");
  //     item.style.display = "none"; // Скрываем из потока
  //   });

  //   // Показываем первые maxItems
  //   itemsToShow.slice(0, maxItems).forEach((item) => {
  //     item.style.display = "block"; // Показываем в потоке
  //     setItemVisibility(item, true);
  //   });

  //   // Показываем кнопку "Показать больше", если нужно
  //   if (loadMore) {
  //     loadMore.style.display =
  //       itemsToShow.length > maxItems ? "inline-flex" : "none";
  //   }
  // };
  const activateTab = (path) => {
    // console.log(`▶️ Активируем вкладку: ${path}`);
    const targetBtn = document.querySelector(
      `.portfolio-tabs-nav__btn[data-path="${path}"]`
    );
    if (!targetBtn) return;

    portfolioTabsBtns.forEach((btn) =>
      btn.classList.remove("portfolio-tabs-nav__btn--active")
    );
    targetBtn.classList.add("portfolio-tabs-nav__btn--active");

    const itemsToShow =
      path === "all"
        ? Array.from(portfolioTabsItems)
        : Array.from(document.querySelectorAll(`[data-target="${path}"]`))
            .map((el) => el.closest(".tabs-content__item"))
            .filter(Boolean);

    portfolioTabsItems.forEach((item) => {
      item.classList.remove("item--visible");
      item.classList.add("item--hidden");
      item.style.display = "none";
    });

    itemsToShow.slice(0, maxItems).forEach((item) => {
      item.style.display = "block";
      requestAnimationFrame(() => {
        item.classList.remove("item--hidden");
        item.classList.add("item--visible");
      });
    });

    if (loadMore) {
      loadMore.style.display =
        itemsToShow.length > maxItems ? "inline-flex" : "none";
    }

    // / 🔽 Прокрутка к карточкам с учётом шапки и табов
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
        cardsWrapper.getBoundingClientRect().top + window.scrollY - totalOffset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  // активация карточек по очереди
  // const activateTab = (path) => {
  //   console.log(`▶️ Активируем вкладку: ${path}`);
  //   const targetBtn = document.querySelector(
  //     `.portfolio-tabs-nav__btn[data-path="${path}"]`
  //   );
  //   if (!targetBtn) return;

  //   portfolioTabsBtns.forEach((btn) =>
  //     btn.classList.remove("portfolio-tabs-nav__btn--active")
  //   );
  //   targetBtn.classList.add("portfolio-tabs-nav__btn--active");

  //   const itemsToShow =
  //     path === "all"
  //       ? Array.from(portfolioTabsItems)
  //       : Array.from(document.querySelectorAll(`[data-target="${path}"]`))
  //           .map((el) => el.closest(".tabs-content__item"))
  //           .filter(Boolean);

  //   // Скрываем все элементы
  //   portfolioTabsItems.forEach((item) => {
  //     item.classList.remove("item--visible");
  //     item.classList.add("item--hidden");
  //     item.style.display = "none";
  //   });

  //   // Каскадное появление
  //   itemsToShow.slice(0, maxItems).forEach((item, index) => {
  //     item.style.display = "block";
  //     setTimeout(() => {
  //       item.classList.remove("item--hidden");
  //       item.classList.add("item--visible");
  //     }, index * 100); // задержка между карточками
  //   });

  //   if (loadMore) {
  //     loadMore.style.display =
  //       itemsToShow.length > maxItems ? "inline-flex" : "none";
  //   }
  // };

  // Инициализация при загрузке — из хеша, query или sessionStorage
  const initTabFromURL = () => {
    let hash = window.location.hash.replace("#", "");
    if (!hash) {
      hash = new URLSearchParams(window.location.search).get("tab");
    }
    if (!hash) {
      hash = sessionStorage.getItem("tab");
      sessionStorage.removeItem("tab");
    }

    // console.log("🔍 Инициализация вкладки из URL:", hash || "all");

    if (!hash) {
      activateTab("all");
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
        activateTab(hash);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(check, 100);
      } else {
        console.warn(`❌ Вкладка "${hash}" не найдена — не активируем "all"`);
      }
    };

    check();
  };

  // Обработчик кнопки "Показать больше"
  if (loadMore) {
    loadMore.addEventListener("click", () => {
      const activePath = document.querySelector(
        ".portfolio-tabs-nav__btn--active"
      )?.dataset.path;
      if (!activePath) return;

      const items =
        activePath === "all"
          ? Array.from(portfolioTabsItems)
          : Array.from(
              document.querySelectorAll(`[data-target="${activePath}"]`)
            )
              .map((el) => el.closest(".tabs-content__item"))
              .filter(Boolean);

      // Показываем скрытые элементы
      items.slice(maxItems).forEach((item, index) => {
        item.style.display = "block";
        setTimeout(() => {
          item.classList.remove("item--hidden");
          item.classList.add("item--visible");
        }, index * 100); // каскадное появление
      });

      loadMore.style.display = "none";
    });
  }

  // Обработчик клика по вкладкам
  if (portfolioTabsNav) {
    portfolioTabsNav.addEventListener("click", (e) => {
      const target = e.target.closest(".portfolio-tabs-nav__btn");
      if (target) {
        activateTab(target.dataset.path);
        history.pushState(null, "", `#${target.dataset.path}`);
      }
    });
  }

  // Инициализация при загрузке
  initTabFromURL();

  // Обработка переходов назад/вперёд
  window.addEventListener("popstate", () => {
    console.log("🔄 popstate: проверяем хеш");
    initTabFromURL();
  });
});
