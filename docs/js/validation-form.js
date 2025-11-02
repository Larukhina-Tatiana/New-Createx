// === Генерация уникального ключа для хранения данных формы ===
const getStorageKey = (form) =>
  "form-storage:" + (form.getAttribute("name") || form.id || "default");

document.addEventListener("DOMContentLoaded", () => {
  // === Класс кастомной валидации формы ===
  class FormsValidation {
    selectors = {
      form: "[data-js-form]",
      fieldErrors: "[data-js-form-field-errors]",
    };

    // === Сообщения об ошибках по типу ===
    errorMessages = {
      valueMissing: () => "Пожалуйста, заполните это поле",
      patternMismatch: ({ title }) => title || "Неверный формат данных",
      tooShort: ({ minLength }) => `Минимум символов — ${minLength}`,
      tooLong: ({ maxLength }) => `Максимум символов — ${maxLength}`,
    };

    constructor() {
      this.bindEvents();
      this.bindAccessibility();
    }

    // === Связь input и блока ошибок через aria-errormessage ===
    bindAccessibility() {
      document.querySelectorAll(this.selectors.form).forEach((form) => {
        const formId = form.getAttribute("name") || form.id || "form";
        form.querySelectorAll("[required]").forEach((input) => {
          const name = input.getAttribute("name");
          if (!name) return; // Пропускаем поля без имени

          // Ищем контейнер для ошибок более надежным способом
          const errorSpan =
            // Сначала ищем по ID, если он уже есть
            form.querySelector(`#${formId}-${name}-error`) ||
            // Затем ищем в родительском label
            input.closest("label")?.querySelector(this.selectors.fieldErrors) ||
            // Или в родительском fieldset (для радио-групп)
            input
              .closest("fieldset")
              ?.querySelector(this.selectors.fieldErrors);

          if (errorSpan) {
            // Генерируем уникальный ID для контейнера ошибок, если его еще нет
            const uniqueId = errorSpan.id || `${formId}-${name}-error`;
            errorSpan.id = uniqueId;
            // Связываем поле с его контейнером ошибок
            input.setAttribute("aria-errormessage", uniqueId);
          }
        });
      });
    }

    // === Отображение ошибок в DOM (ЕДИНАЯ ФУНКЦИЯ) ===
    manageErrors(formControlElement, errorMessages) {
      // Находим ID контейнера ошибок по aria-атрибуту
      const errorId = formControlElement.getAttribute("aria-errormessage");
      if (!errorId) return;

      const fieldErrorsElement = document.getElementById(errorId);

      if (fieldErrorsElement) {
        // Обновляем содержимое контейнера, создавая HTML для ошибок
        fieldErrorsElement.innerHTML = errorMessages
          .map((msg) => `<span class="form-error">${msg}</span>`)
          .join("");
      }
    }

    // === Валидация radio-группы (НОВАЯ ФУНКЦИЯ) ===
    validateRadioGroup(radioElement) {
      const errorMessages = [];
      const form = radioElement.closest(this.selectors.form);
      const groupName = radioElement.name;
      const group = form.querySelectorAll(`input[name="${groupName}"]`);
      const isRequired = [...group].some((radio) => radio.required);

      // Если группа не обязательна, валидация не нужна
      if (!isRequired) return true;

      const isChecked = [...group].some((radio) => radio.checked);
      const wrapper = radioElement.closest(".form__fields-inner");

      if (!isChecked) {
        errorMessages.push(
          "Пожалуйста, выберите предпочтительный способ связи"
        );
      }

      if (wrapper) {
        wrapper.classList.toggle("is-invalid", !isChecked);
      }

      // Обновляем ARIA-атрибуты для всей группы
      group.forEach((radio) => {
        radio.setAttribute("aria-invalid", String(!isChecked));
      });

      // Отображаем ошибку один раз для всей группы, используя первый элемент
      this.manageErrors(group[0], errorMessages);

      return isChecked;
    }

    // === Валидация одного поля (кроме radio) ===
    validateField(formControlElement) {
      const errorMessages = [];
      const errors = formControlElement.validity;
      const isSelect = formControlElement.tagName === "SELECT";

      // --- Логика для radio-групп вынесена в validateRadioGroup ---

      // === Кастомная проверка для SELECT с Choices.js ===
      if (
        isSelect &&
        formControlElement.required &&
        !formControlElement.value
      ) {
        errorMessages.push("Пожалуйста, выберите локацию");
      }

      // === Стандартные HTML5 ошибки (кроме radio и select)
      if (!isSelect) {
        Object.entries(this.errorMessages).forEach(([type, getMessage]) => {
          if (errors[type]) {
            errorMessages.push(getMessage(formControlElement));
          }
        });
      }

      // === Определяем валидность поля
      const isValid = errorMessages.length === 0;

      // === Обновляем aria-атрибуты
      formControlElement.setAttribute("aria-invalid", !isValid);

      // === Обновляем классы для визуальной обратной связи
      formControlElement.classList.toggle("is-valid", isValid);
      formControlElement.classList.toggle("is-invalid", !isValid);

      // === Для SELECT с Choices.js — стилизуем .choices__inner
      if (isSelect) {
        const wrapper = formControlElement
          .closest(".choices")
          ?.querySelector(".choices__inner");
        if (wrapper) {
          wrapper.classList.toggle("is-valid", isValid);
          wrapper.classList.toggle("is-invalid", !isValid);
        }
      }

      // === Отображаем или очищаем сообщение об ошибке через единую функцию
      this.manageErrors(formControlElement, errorMessages);

      return isValid;
    }

    // === Валидация при потере фокуса любого required-поля ===
    onBlur(event) {
      const { target } = event;
      const form = target.closest(this.selectors.form);

      if (!form || !target.required) return;

      // --- Вызываем соответствующий валидатор ---
      if (target.type === "radio") {
        this.validateRadioGroup(target);
      } else {
        this.validateField(target);
      }
    }

    // === Валидация при изменении чекбоксов и радио ===
    onChange(event) {
      const { target } = event;
      const form = target.closest(this.selectors.form);

      if (!form || !target.required) return;

      // --- Вызываем соответствующий валидатор ---
      if (target.type === "radio") {
        this.validateRadioGroup(target);
      } else if (["select-one", "checkbox"].includes(target.type)) {
        this.validateField(target);
      }
    }

    // === Обработка отправки формы ===
    onSubmit(event) {
      const form = event.target;
      if (!form.matches(this.selectors.form)) return;

      event.preventDefault(); // Предотвращаем отправку сразу

      const storageKey = getStorageKey(form);
      const requiredFields = [...form.elements].filter((el) => el.required);
      let isFormValid = true;
      let firstInvalid = null;

      // --- Обрабатываем радио-группы как единое целое ---
      const validatedRadioGroups = new Set();

      requiredFields.forEach((el) => {
        let isFieldValid;

        if (el.type === "radio") {
          // Валидируем группу только один раз
          if (validatedRadioGroups.has(el.name)) {
            return; // Группа уже проверена, пропускаем
          }
          isFieldValid = this.validateRadioGroup(el);
          validatedRadioGroups.add(el.name);
        } else {
          // Валидируем все остальные поля
          isFieldValid = this.validateField(el);
        }

        if (!isFieldValid) {
          isFormValid = false;
          if (!firstInvalid) {
            firstInvalid = el;
          }
        }
      });

      if (!isFormValid) {
        firstInvalid?.focus();
      } else {
        let savedData = null;
        try {
          savedData = localStorage.getItem(storageKey);
        } catch (error) {
          console.error("Ошибка чтения из localStorage:", error);
        }

        const rawData = savedData ? JSON.parse(savedData) : {};

        // === Очистка данных от лишних пробелов ===
        const cleanedData = {};
        for (let key in rawData) {
          const value = rawData[key];
          if (typeof value === "string") {
            cleanedData[key] = value
              .replace(/^\s+|\s+$/g, "")
              .replace(/\n{2,}/g, "\n")
              .trim();
          } else {
            cleanedData[key] = value;
          }
        }

        console.log("✅ Отправка данных:", cleanedData);

        form.reset();
        // После сброса отмечаем чекбокс вручную
        const policyCheckbox = form.querySelector(".js-policy-checkbox");
        if (policyCheckbox) policyCheckbox.checked = true;

        try {
          localStorage.removeItem(storageKey);
        } catch (error) {
          console.error("Ошибка удаления из localStorage:", error);
        }
        createAlertBox(form); // функция отображения успешного сообщения
      }
    }

    // === Привязка событий ===
    bindEvents() {
      document.addEventListener("blur", (e) => this.onBlur(e), true);
      document.addEventListener("change", (e) => this.onChange(e));
      document.addEventListener("submit", (e) => this.onSubmit(e));
    }
  }

  // === Инициализация валидации ===
  new FormsValidation();

  // === Сохранение данных формы в localStorage при вводе ===
  document.querySelectorAll("[data-js-form]").forEach((form) => {
    const storageKey = getStorageKey(form);

    const handleSave = ({ target }) => {
      const { name, type, value, checked } = target;
      if (!name) return;

      let currentData = {};
      try {
        currentData = JSON.parse(localStorage.getItem(storageKey)) || {};
      } catch (error) {
        console.error("Ошибка чтения из localStorage:", error);
        return; // Если не можем прочитать, нет смысла продолжать
      }

      // Обрабатываем чекбоксы и остальные поля по-разному
      if (type === "checkbox") {
        // Для чекбоксов всегда сохраняем их состояние (true/false)
        currentData[name] = checked;
      } else {
        // Для текстовых полей очищаем значение
        const cleanedValue = value.replace(/\n{2,}/g, "\n").trim();

        if (cleanedValue) {
          // Если после очистки что-то осталось, сохраняем
          currentData[name] = cleanedValue;
        } else {
          // Если поле стало пустым, удаляем его из хранилища
          delete currentData[name];
        }
      }

      // Если в объекте данных больше не осталось ключей,
      // удаляем всю запись для этой формы из localStorage.
      if (Object.keys(currentData).length === 0) {
        try {
          localStorage.removeItem(storageKey);
        } catch (error) {
          console.error("Ошибка удаления из localStorage:", error);
        }
      } else {
        // Иначе сохраняем обновленный объект.
        try {
          localStorage.setItem(storageKey, JSON.stringify(currentData));
        } catch (error) {
          console.error("Ошибка записи в localStorage:", error);
        }
      }
    };

    form.addEventListener("input", handleSave);
    form.addEventListener("change", handleSave);
  });

  // === Восстановление данных из localStorage при загрузке ===
  document.querySelectorAll("[data-js-form]").forEach((form) => {
    const storageKey = getStorageKey(form);
    let saved = null;
    try {
      saved = localStorage.getItem(storageKey);
    } catch (error) {
      console.error("Ошибка чтения из localStorage:", error);
    }
    if (!saved) return;

    const formData = JSON.parse(saved);
    for (let key in formData) {
      const el = form.elements[key];
      if (!el) continue;

      // === Обработка разных типов полей ===
      if (el.length && el[0]?.type === "radio") {
        // Для radio-групп ищем нужный элемент по значению
        const radioToSelect = [...el].find(
          (radio) => radio.value === formData[key]
        );
        if (radioToSelect) {
          radioToSelect.checked = true;
          // Вызываем событие, чтобы другие скрипты (если есть) отреагировали
          radioToSelect.dispatchEvent(new Event("change", { bubbles: true }));
        }
      } else if (el.type === "checkbox") {
        // Для чекбоксов восстанавливаем состояние checked
        el.checked = formData[key];
        el.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        // Для остальных полей (text, textarea, select)
        el.value = formData[key];
        // Для select с Choices.js нужно вызвать событие, чтобы обновился UI
        if (el.tagName === "SELECT") {
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
    }
  });

  // === Маска телефона и прогресс-бар ===
  document.querySelectorAll("[data-js-form]").forEach((form, index) => {
    if (typeof IMask === "undefined") {
      console.warn("IMask не подключён, маска телефона не будет работать.");
      return;
    }

    const phoneInput = form.querySelector("[data-js-phone]");
    const progressLine = form.querySelector(".progress-line");

    if (phoneInput && typeof IMask !== "undefined") {
      IMask(phoneInput, {
        mask: "+{38} (000) 000-00-00",
      });

      phoneInput.addEventListener("input", function () {
        const length = this.value.length;
        const w = this.offsetWidth;
        if (progressLine) {
          progressLine.style.width = (w / 19) * length + "px";
          progressLine.style.backgroundColor = `rgb(${
            255 - (255 / 19) * length
          },137,0)`;
        }
      });

      phoneInput.addEventListener("blur", () => {
        if (progressLine) progressLine.style.display = "none";
      });

      phoneInput.addEventListener("focus", () => {
        if (progressLine) progressLine.style.display = "block";
      });
    }
  });

  // === Блокировка кнопки отправки, если политика не принята (для каждой формы) ===
  document.querySelectorAll("[data-js-form]").forEach((form) => {
    // Ищем чекбокс и кнопку внутри каждой конкретной формы
    const policyCheckbox = form.querySelector(".js-policy-checkbox");
    const btnSubmit = form.querySelector("[data-js-submit]");

    if (policyCheckbox && btnSubmit) {
      // Устанавливаем начальное состояние кнопки
      btnSubmit.disabled = !policyCheckbox.checked;
      // Добавляем обработчик для отслеживания изменений
      policyCheckbox.addEventListener("change", (e) => {
        btnSubmit.disabled = !e.currentTarget.checked;
      });
    }
  });
});
