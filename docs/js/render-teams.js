// Глобальная переменная для хранения данных о команде.
let teamData = [];

/**
 * Отображает сообщение об ошибке в контейнере списка команды.
 * @param {string} message - Сообщение об ошибке для отображения.
 */
function showError(message) {
  const list = document.querySelector(".team__list");
  if (list) {
    // Очищаем контейнер и выводим сообщение об ошибке.
    // Стилизуем его для лучшей видимости.
    list.innerHTML = `<li class="error-message" style="text-align: center; color: red; grid-column: 1 / -1; padding: 20px;">${message}</li>`;
  }
}

/**
 * Возвращает текст сообщения об ошибке в зависимости от типа ошибки.
 * @param {object} error - Объект ошибки, может содержать статус ответа.
 * @returns {string} - Текст сообщения об ошибке.
 */
function getErrorMessage(error) {
  if (error.status) {
    if (error.status === 404) {
      return "Файл с данными команды (team.json) не найден.";
    }
    if (error.status >= 500) {
      return "Произошла ошибка на сервере. Пожалуйста, попробуйте позже.";
    }
  }
  if (error.message && error.message.includes("Failed to fetch")) {
    return "Не удалось подключиться к серверу. Проверьте ваше интернет-соединение.";
  }
  return "Произошла непредвиденная ошибка при загрузке данных.";
}

/**
 * Асинхронно загружает данные о команде из JSON-файла.
 */
async function loadTeamData() {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.classList.add("loader--visible");
  }

  try {
    // Загружаем данные из файла team.json.
    // Путь './data/team.json' предполагает, что в итоговой сборке
    // папка data будет находиться в корне сайта.
    const response = await fetch("./data/team.json");

    if (!response.ok) {
      throw {
        status: response.status,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();
    teamData = data;

    // После успешной загрузки вызываем функцию рендеринга.
    renderTeamMembers();
  } catch (error) {
    console.error("Ошибка загрузки данных о команде:", error);
    showError(getErrorMessage(error));
  } finally {
    // Скрываем лоадер после завершения операции.
    if (loader) {
      loader.classList.remove("loader--visible");
    }
  }
}

/**
 * Рендерит список членов команды на странице.
 */
function renderTeamMembers() {
  const list = document.querySelector(".team__list");
  const loader = document.querySelector(".loader");

  if (!list) {
    console.error("Контейнер .team__list не найден на странице.");
    return;
  }

  const fragment = document.createDocumentFragment();

  if (!teamData || !Array.isArray(teamData.team)) {
    showError("Данные о команде имеют неверный формат.");
    return;
  }

  teamData.team.forEach((member) => {
    const li = document.createElement("li");
    li.className = "team__item animate-on-scroll";

    // Генерируем HTML для иконок социальных сетей,
    // следуя структуре шаблона social-media.njk
    const socialsHtml = member.socials
      .map(
        (social) => `
      <li class="social__item social__item--team">
        <a class="social__link" href="${social.url}" aria-label="${social.label}" target="_blank"
          rel="noopener noreferrer">
          <svg focusable="false" aria-hidden="true">
            <use href="images/icons/sprite.svg#${social.name}"></use>
          </svg>
        </a>
      </li>
    `
      )
      .join("");

    // Формируем полную HTML-структуру карточки.
    li.innerHTML = `
      <div class="team__thumb images__thumb images__thumb--team">
        <picture>
          <source type="image/avif" srcset="${member.image.base}@1x.avif 1x, ${member.image.base}@2x.avif 2x">
          <source type="image/webp" srcset="${member.image.base}@1x.webp 1x, ${member.image.base}@2x.webp 2x">
          <img class="images__img" src="${member.image.base}@1x.jpg" loading="lazy" decoding="async" alt="${member.image.alt}">
        </picture>
        <div class="team__hover">
          <address class="social-media">
            <ul class="social social--team">
              ${socialsHtml}
            </ul>
          </address>
        </div>
      </div>
      <div class="team__caption">
        <h3 class="team__subtitle section__titleh3">${member.name}</h3>
        <p class="team__post">${member.post}</p>
      </div>
    `;
    fragment.appendChild(li);
  });

  // Очищаем список и добавляем новые элементы.
  list.innerHTML = ""; // Очищаем старое содержимое
  list.appendChild(fragment);

  if (loader) {
    loader.style.display = "none";
  }

  // Инициализация анимации для динамически добавленных элементов
  const newItems = list.querySelectorAll(".animate-on-scroll");
  if (newItems.length > 0) {
    // Проверяем, поддерживается ли IntersectionObserver
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Добавляем или удаляем класс .in-view в зависимости от видимости
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
            } else {
              // Позволяет анимации сработать снова при повторном появлении
              entry.target.classList.remove("in-view");
            }
          });
        },
        {
          threshold: 0.2, // Анимация сработает, когда 20% элемента видно
        }
      );

      // Начинаем отслеживать каждый новый элемент
      newItems.forEach((item) => observer.observe(item));
    } else {
      // Фолбэк для старых браузеров: просто показываем элементы
      newItems.forEach((item) => item.classList.add("in-view"));
    }
  }
}

// Запускаем загрузку данных.
loadTeamData();
