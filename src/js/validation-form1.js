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
          const errorSpan =
            form.querySelector(`#${formId}-${name}-error`) ||
            input.closest("label")?.querySelector(this.selectors.fieldErrors);
          if (name && errorSpan) {
            const uniqueId = `${formId}-${name}-error`;
            errorSpan.id = uniqueId;
            input.setAttribute("aria-errormessage", uniqueId);
          }
        });
      });
    }

    // === Отображение ошибок в DOM ===
    manageErrors(formControlElement, errorMessages) {
      const fieldErrorsElement = formControlElement
        .closest("label")
        ?.querySelector(this.selectors.fieldErrors);

      if (fieldErrorsElement) {
        fieldErrorsElement.innerHTML = errorMessages
          .map((msg) => `<span class="form-error">${msg}</span>`)
          .join("");
      }
    }

    // === Валидация одного поля ===
    validateField(formControlElement) {
      const errorMessages = [];
      const errors = formControlElement.validity;
      const isSelect = formControlElement.tagName === "SELECT";
      const errorSpan =
        formControlElement
          .closest("label")
          ?.querySelector(this.selectors.fieldErrors) ||
        formControlElement
          .closest("fieldset")
          ?.querySelector(this.selectors.fieldErrors);

      // === Кастомная проверка для radio-группы ===
      if (formControlElement.type === "radio" && formControlElement.required) {
        const form = formControlElement.closest(this.selectors.form);
        const group = form.querySelectorAll(
          `input[name="${formControlElement.name}"]`
        );
        const isChecked = [...group].some((radio) => radio.checked);

        const wrapper = formControlElement.closest(".form__fields-inner");
        if (!isChecked) {
          errorMessages.push(
            "Пожалуйста, выберите предпочтительный способ связи"
          );
          if (wrapper) wrapper.classList.add("is-invalid");
        } else {
          if (wrapper) wrapper.classList.remove("is-invalid");
        }
      }

      // === Кастомная проверка для SELECT с Choices.js ===
      if (
        isSelect &&
        formControlElement.required &&
        !formControlElement.value
      ) {
        errorMessages.push("Пожалуйста, выберите локацию");
      }

      // === Стандартные HTML5 ошибки (если это не SELECT)
      if (!isSelect && formControlElement.type !== "radio") {
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

      // === Отображаем или очищаем сообщение об ошибке
      if (errorSpan) {
        errorSpan.innerHTML = isValid
          ? ""
          : errorMessages
              .map((msg) => `<span class="form-error">${msg}</span>`)
              .join("");
      }
      console.log("valid?", isValid);

      return isValid;
    }

    // === Валидация при потере фокуса любого required-поля ===
    onBlur(event) {
      const { target } = event;
      const form = target.closest(this.selectors.form);

      if (!form || !target.required) return;

      // === Для radio-группы — валидируем всю группу по name
      if (target.type === "radio") {
        const group = form.querySelectorAll(`input[name="${target.name}"]`);
        group.forEach((radio) => this.validateField(radio));
      } else {
        this.validateField(target);
      }
    }

    // === Валидация при изменении чекбоксов и радио ===
    onChange(event) {
      const { target } = event;
      const form = target.closest(this.selectors.form);

      if (!form || !target.required) return;

      // === Валидация для select, radio, checkbox
      if (["select-one", "radio", "checkbox"].includes(target.type)) {
        this.validateField(target);
      }
    }

    // === Обработка отправки формы ===
    onSubmit(event) {
      const form = event.target;
      if (!form.matches(this.selectors.form)) return;

      const storageKey = getStorageKey(form);
      const requiredFields = [...form.elements].filter((el) => el.required);
      let isValid = true;
      let firstInvalid = null;

      requiredFields.forEach((el) => {
        const valid = this.validateField(el);
        if (!valid) {
          isValid = false;
          if (!firstInvalid) firstInvalid = el;
        }
      });

      event.preventDefault();

      if (!isValid) {
        firstInvalid.focus();
      } else {
        const savedData = localStorage.getItem(storageKey);
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
        localStorage.removeItem(storageKey);
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

      const cleanedValue =
        type === "checkbox"
          ? checked
          : value
              .replace(/^\s+|\s+$/g, "")
              .replace(/\n{2,}/g, "\n")
              .trim();

      const currentData = JSON.parse(localStorage.getItem(storageKey)) || {};
      currentData[name] = cleanedValue;

      localStorage.setItem(storageKey, JSON.stringify(currentData));
    };

    form.addEventListener("input", handleSave);
    form.addEventListener("change", handleSave);
  });

  // === Восстановление данных из localStorage при загрузке ===
  document.querySelectorAll("[data-js-form]").forEach((form) => {
    const storageKey = getStorageKey(form);
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;

    const formData = JSON.parse(saved);
    for (let key in formData) {
      const el = form.elements[key];
      if (!el) continue;
      if (el.type === "checkbox") {
        el.checked = formData[key];
      } else {
        el.value = formData[key];
      }
    }
  });

  // === Маска телефона и прогресс-бар ===
  document.querySelectorAll("[data-js-form]").forEach((form, index) => {
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

  // === Блокировка кнопки отправки, если политика не принята ===
  const policyCheckbox = document.querySelector("#policy");
  const btnSubmit = document.querySelector("[data-js-submit]");

  if (policyCheckbox && btnSubmit) {
    btnSubmit.disabled = !policyCheckbox.checked;
    policyCheckbox.addEventListener("change", (e) => {
      btnSubmit.disabled = !e.currentTarget.checked;
    });
  }
});
