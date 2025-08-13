// import { createAlertBox } from "./create-alertbox.js";

// Генерация уникального ключа для хранения данных формы
const getStorageKey = (form) =>
  "form-storage:" + (form.getAttribute("name") || form.id || "default");

document.addEventListener("DOMContentLoaded", () => {
  // === Класс кастомной валидации ===
  class FormsValidation {
    selectors = {
      form: "[data-js-form]",
      fieldErrors: "[data-js-form-field-errors]",
    };

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

    // === Доступность: связываем input и блок ошибок через aria-errormessage ===
    bindAccessibility() {
      document.querySelectorAll(this.selectors.form).forEach((form) => {
        const formId = form.getAttribute("name") || form.id || "form";
        form.querySelectorAll("[required]").forEach((input) => {
          const name = input.getAttribute("name");
          const errorSpan = input
            .closest("label")
            ?.querySelector(this.selectors.fieldErrors);
          if (name && errorSpan) {
            const uniqueId = `${formId}-${name}-error`;
            errorSpan.id = uniqueId;
            input.setAttribute("aria-errormessage", uniqueId);
          }
        });
      });
    }

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

    validateField(formControlElement) {
      const errors = formControlElement.validity;
      const errorMessages = [];

      Object.entries(this.errorMessages).forEach(([type, getMessage]) => {
        if (errors[type]) {
          errorMessages.push(getMessage(formControlElement));
        }
      });

      formControlElement.ariaInvalid = errorMessages.length > 0;
      this.manageErrors(formControlElement, errorMessages);

      return errorMessages.length === 0;
    }

    onBlur(event) {
      const { target } = event;
      const form = target.closest(this.selectors.form);
      if (form && target.required) {
        this.validateField(target);
      }
    }

    onChange(event) {
      const { target } = event;
      const form = target.closest(this.selectors.form);
      if (
        form &&
        target.required &&
        ["checkbox", "radio"].includes(target.type)
      ) {
        this.validateField(target);
      }
    }

    // === Отправка формы с очисткой данных ===
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

        // === Очистка данных: удаление лишних пробелов и пустых строк ===
        const cleanedData = {};
        for (let key in rawData) {
          const value = rawData[key];
          if (typeof value === "string") {
            cleanedData[key] = value
              .replace(/^\s+|\s+$/g, "") // пробелы по краям
              .replace(/\n{2,}/g, "\n") // множественные пустые строки
              .trim(); // финальная очистка
          } else {
            cleanedData[key] = value;
          }
        }

        console.log("✅ Отправка данных:", cleanedData);

        form.reset();
        localStorage.removeItem(storageKey);
        createAlertBox(form);
      }
    }

    bindEvents() {
      document.addEventListener("blur", (e) => this.onBlur(e), true);
      document.addEventListener("change", (e) => this.onChange(e));
      document.addEventListener("submit", (e) => this.onSubmit(e));
    }
  }

  new FormsValidation();

  // === Сохранение данных формы в localStorage при вводе с очисткой ===
  document.querySelectorAll("[data-js-form]").forEach((form) => {
    const storageKey = getStorageKey(form);

    form.addEventListener("input", ({ target }) => {
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
    });
  });

  // === Восстановление данных из localStorage ===
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

  // === Маска телефона и прогресс-бар для каждой формы ===
  document.querySelectorAll("[data-js-form]").forEach((form, index) => {
    const phoneInput = form.querySelector("[data-js-phone]");
    const progressLine = form.querySelector(".progress-line");

    if (phoneInput) {
      const uniqueId = `phone-mask-${index}`;
      phoneInput.id = uniqueId;

      if (typeof IMask !== "undefined") {
        IMask(phoneInput, {
          mask: "+{38} ({\\000) 000-00-00",
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
