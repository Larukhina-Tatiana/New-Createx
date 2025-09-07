let portfolioData = [];
// let currentIndex = 0;
// const itemsPerPage = 6;
// const loadMoreBtn = document.querySelector(".portfolio-more");

function showError(message) {
  const parentErrorElement = document.querySelector(
    ".portfolio-sticky-wrapper"
  );
  if (parentErrorElement && !document.querySelector(".error-message")) {
    const errorElement = document.createElement("div");
    errorElement.textContent = message;
    errorElement.classList.add("error-message");
    parentErrorElement.appendChild(errorElement);
  }
}

function getErrorMessage(error) {
  if (error.message.includes("404")) {
    return "Файл portfolio.json не найден.";
  }
  if (error.message.includes("500")) {
    return "Сервер вернул ошибку. Попробуйте позже.";
  }
  if (error.message.includes("Failed to fetch")) {
    return "Нет соединения с сервером. Проверьте интернет.";
  }
  return "Произошла ошибка при загрузке данных.";
}

async function loadPortfolioData() {
  const loader = document.querySelector(".loader");
  if (loader) loader.classList.add("loader--visible");

  try {
    // Искусственная задержка для проверки анимации
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await fetch("./data/portfolio.json");
    if (!response.ok) {
      throw { status: response.status };
    }
    const data = await response.json();
    portfolioData = data;
    // console.log(data); // Уберите в продакшене
    renderPortfolioItems();
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    showError(getErrorMessage(error));
  } finally {
    if (loader) loader.classList.remove("loader--visible");
  }
}

function renderPortfolioItems() {
  // console.log("работаем");

  const list = document.querySelector(".portfolio-tabs-content");
  const fragment = document.createDocumentFragment();

  portfolioData.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("tabs-content__item", "tabs-content__item--visible");

    li.innerHTML = `
      <a class="section__slider-slide" id="${item.id}" href="${
      item.available ? item.href : "#"
    }" data-target="${item.target}" aria-label="${item.title}" ${
      !item.available
        ? 'style="pointer-events: none; cursor: not-allowed; opacity: .5" onclick="event.preventDefault(); alert(\'Страница проекта ещё в разработке.\')"'
        : ""
    }>
        <picture>
          <source type="image/avif" srcset="${item.image}@1x.avif 1x, ${
      item.image
    }@2x.avif 2x">
          <source type="image/webp" srcset="${item.image}@1x.webp 1x, ${
      item.image
    }@2x.webp 2x">
          <img class="section__slider-img" src="${
            item.src
          }" loading="lazy" decoding="async" alt="${item.alt}">
        </picture>
        <div class="section__slider-content">
          <h3 class="section__slider-title section__titleh3">${item.title}</h3>
          <p class="section__slider-descr">${item.category}</p>
          <div class="section__slider-link button button--regular">View Project</div>
        </div>
      </a>
    `;
    fragment.appendChild(li);
  });
  list.appendChild(fragment);

  if (typeof window.initTabs === "function") {
    window.initTabs();
  }
  if (typeof window.initTabFromURL === "function") {
    window.initTabFromURL();
  }
}
loadPortfolioData();
