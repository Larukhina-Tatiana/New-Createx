import { createAlertBox } from "./create-alertbox.js";
const STORAGE_KEY = "application-form";

let formData = {};

class FormsValidation {
  selectors = {
    form: "[data-js-form]",
    fieldErrors: "[data-js-form-field-errors]",
  };

  errorMessages = {
    valueMissing: () => "Пожалуйста, заполните это поле",
    patternMismatch: ({ title }) => title || "Данные не соответствуют формату",
    tooShort: ({ minLength }) =>
      `Слишком короткое значение, минимум символов — ${minLength}`,
    tooLong: ({ maxLength }) =>
      `Слишком длинное значение, ограничение символов — ${maxLength}`,
  };

  constructor() {
    this.bindEvents();
  }

  manageErrors(formControlElement, errorMessages) {
    const fieldErrorsElement = formControlElement.parentElement.querySelector(
      this.selectors.fieldErrors
    );

    if (fieldErrorsElement) {
      fieldErrorsElement.innerHTML = errorMessages
        .map((message) => `<span class="form-error">${message}</span>`)
        .join("");
    }
  }

  validateField(formControlElement) {
    console.log("validity", formControlElement.validity);

    const errors = formControlElement.validity;
    const errorMessages = [];

    Object.entries(this.errorMessages).forEach(
      ([errorType, getErrorMessage]) => {
        if (errors[errorType]) {
          errorMessages.push(getErrorMessage(formControlElement));
        }
      }
    );

    this.manageErrors(formControlElement, errorMessages);

    const isValid = errorMessages.length === 0;

    formControlElement.ariaInvalid = !isValid;
    return isValid;
  }

  onBlur(event) {
    const { target } = event;
    if (!target || !target.closest) return;

    const isFormField = target.closest(this.selectors.form);
    const isRequired = target.required;

    if (isFormField && isRequired) {
      this.validateField(target);
    }
  }

  onChange(event) {
    const { target } = event;
    const isRequired = target.required;
    const isToggleType = ["radio", "checkbox"].includes(target.type);

    if (isToggleType && isRequired) {
      this.validateField(target);
    }
  }

  onSubmit(event) {
    const isFormElement = event.target.matches(this.selectors.form);

    if (!isFormElement) {
      return;
    }

    const requiredControlElements = [...event.target.elements].filter(
      ({ required }) => required
    );
    let isFormValid = true;
    let firstInvalidFieldControl = null;

    requiredControlElements.forEach((element) => {
      const isFieldValid = this.validateField(element);

      if (!isFieldValid) {
        isFormValid = false;

        if (!firstInvalidFieldControl) {
          firstInvalidFieldControl = element;
        }
      }
    });

    if (!isFormValid) {
      event.preventDefault();
      firstInvalidFieldControl.focus();
    }
    if (isFormValid) {
      event.preventDefault();
      console.log(
        "✅ Отправка данных:",
        JSON.parse(localStorage.getItem(STORAGE_KEY))
      );
      // Очистка LS
      event.target.reset();
      localStorage.removeItem(STORAGE_KEY);
      createAlertBox(event.target);

      // ✅ ДОБАВЬ ЭТО СЮДА
      const fakeId = Math.floor(Math.random() * 5000);
      window.location.href = `/Createx/${fakeId}#page`;
    }
  }

  bindEvents() {
    document.addEventListener(
      "blur",
      (event) => {
        this.onBlur(event);
      },
      { capture: true }
    );
    document.addEventListener("change", (event) => this.onChange(event));
    document.addEventListener("submit", (event) => this.onSubmit(event));
    // document.addEventListener("change", (event) => this.onPolicyChange(event));
  }
}

new FormsValidation();

const formLs = document.forms.applicationForm;
if (!formLs) {
  console.error("Форма не найдена");
} else {
  formLs.addEventListener("input", onFormInput);
}

function onFormInput(event) {
  console.log("event.target.type", event.target.type);

  if (event.target.type === "checkbox") {
    formData[event.target.name] = event.target.checked;
  } else {
    formData[event.target.name] = event.target.value;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
}

// Возврат из LS при обновлении страницы
(function populateFormOutput() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (!savedData) return;

  formData = JSON.parse(savedData);
  console.log(formData);

  for (let key in formData) {
    if (formLs.elements[key]) {
      if (formLs.elements[key].type === "checkbox") {
        formLs.elements[key].checked = formData[key];
      } else {
        formLs.elements[key].value = formData[key];
      }
    }
  }
})();

// Шаблон для номера телефона
const progressLine = document.querySelector(".progress-line");
const phoneMask = document.getElementById("phone-mask");
if (phoneMask) {
  IMask(phoneMask, {
    mask: "+{38} ({\\000) 000-00-00",
  });

  phoneMask.oninput = function () {
    const lengthOfIinput = this.value.length;
    const w = this.offsetWidth;

    if (progressLine) {
      progressLine.style.width = (w / 19) * lengthOfIinput + "px";
      progressLine.style.backgroundColor = `rgb(${
        255 - (255 / 19) * lengthOfIinput
      },137,0)`;
    }
  };

  phoneMask.addEventListener("blur", function (event) {
    if (progressLine) {
      progressLine.style.display = "none";
    }
  });
  phoneMask.addEventListener("focus", function (event) {
    if (progressLine) {
      progressLine.style.display = "block";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Проверка на checked
  const refs = {
    form: document.querySelector("[data-js-form]"),
    policyCheckbox: document.querySelector("#policy"),
    btnSubmit: document.querySelector("[data-js-submit]"),
  };

  if (refs.policyCheckbox && refs.btnSubmit) {
    refs.policyCheckbox.addEventListener("change", onPolicyChange);

    function onPolicyChange(event) {
      refs.btnSubmit.disabled = !event.currentTarget.checked;
    }
  }
});
