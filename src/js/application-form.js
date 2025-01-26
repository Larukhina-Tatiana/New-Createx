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

    fieldErrorsElement.innerHTML = errorMessages
      .map((message) => `<span class="form-error">${message}</span>`)
      .join("");
  }

  validateField(formControlElement) {
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
      // Очистка LS
      event.target.reset();
      localStorage.removeItem(STORAGE_KEY);

      alert("Форма отправлена");
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
formLs.addEventListener("input", onFormInput);
const STORAGE_KEY = "application-form";

let formData = {};
function onFormInput(event) {
  formData[event.target.name] = event.target.value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
}

// Возврат из LS при обновлении страницы
(function populateFormOutput() {
  if (localStorage.getItem(STORAGE_KEY)) {
    formData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    console.log(formData);
    for (let key in formData) {
      if (
        formLs.elements[key].type === "chekbox" &&
        formLs.elements[key].value === "on"
      ) {
        formLs.elements[key].checked = true;
      } else {
        formLs.elements[key].value = formData[key];
      }
    }
  }
})();

// Шаблон для номера телефона
const progressLine = document.querySelector(".progress-line");
const phoneMask = document.getElementById("phone-mask");
IMask(phoneMask, {
  mask: "+{38} ({\\000) 000-00-00",
});

document.getElementById("phone-mask").oninput = function () {
  const lengthOfIinput = this.value.length;
  const w = this.offsetWidth;

  progressLine.style.width = (w / 19) * lengthOfIinput + "px";
  progressLine.style.backgroundColor = `rgb(${
    255 - (255 / 19) * lengthOfIinput
  },137,0)`;
};

phoneMask.addEventListener("blur", function (event) {
  progressLine.style.display = "none";
});
phoneMask.addEventListener("focus", function (event) {
  progressLine.style.display = "block";
});

// Проверка на checked
const refs = {
  form: "[data-js-form]",
  policyСheckbox: document.querySelector("#policy"),
  btnSubmit: "[js-submit]",
};

refs.policyСheckbox.addEventListener("change", onPolicyChange);

function onPolicyChange(event) {
  refs.btnSubmit.disabled = !event.currentTarget.checked;
}
