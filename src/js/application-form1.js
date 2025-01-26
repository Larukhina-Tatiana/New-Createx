const refs = {
  form: document.forms.applicationForm,
  policyСheckbox: document.querySelector("#policy"),
  btn: document.querySelector(".application-form__form button"),
};

let textError = "";
let formData = {};
// const form = document.querySelector(".application-form__form");
// console.log(form.elements);

refs.form.addEventListener("submit", onFormSubmit);

refs.form.addEventListener("input", onFormInput);
const STORAGE_KEY = "feedback-application-form";
populateTextareaOutput();

function onFormSubmit(e) {
  e.preventDefault();

  if (validationForm(refs.form) === true) {
    alert("Форма проверена");
    // Сбор данных формы
    const formData = new FormData(e.currentTarget);
    formData.forEach((value, name) => {
      console.log(name, value);
    });
    // Очистка LS
    e.currentTarget.reset();
    localStorage.removeItem(STORAGE_KEY);
  } else {
    e.preventDefault();
    // alert("Форма не прошла вылидацию");
  }
}

function validationForm(form) {
  let result = true;
  const inputAll = form.querySelectorAll("[data-required]");

  inputAll.forEach((input) => {
    const inputValue = input.value;
    const inputReg = input.getAttribute("data-reg");
    const reg = new RegExp(inputReg);

    if (reg.test(inputValue) !== true) {
      const inputError = input.name;
      onTextError(inputError);
      input.parentElement.insertAdjacentHTML(
        "beforeend",
        `<div class="form__error"> ${textError} </div>`
      );
      input.style.boxShadow = "0 0 4px rgb(255, 0, 0)";
      input.addEventListener("focus", function (event) {
        if (input.nextElementSibling) {
          input.nextElementSibling.remove();
          input.style.boxShadow = "";
        }
      });
      result = false;
    }
  });

  return result;
}

function onTextError(inputError) {
  if (inputError === "first-name") {
    textError = "Incorrect name, enter name without spaces!";
  }
  if (inputError === "phone") {
    textError = "Incorrect phone number!";
  }
  if (inputError === "e-mail") {
    textError = "Incorrect email!";
  }
  if (inputError === "comment") {
    textError = "Incorrect email!";
  }
  return textError;
}

// Возврат из LS при обновлении страницы
function populateTextareaOutput() {
  if (localStorage.getItem(STORAGE_KEY)) {
    formData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    console.log(formData);
    for (let key in formData) {
      if (
        refs.form.elements[key].type === "chekbox" &&
        refs.form.elements[key].value === "on"
      ) {
        refs.form.elements[key].checked = true;
      } else {
        refs.form.elements[key].value = formData[key];
      }
    }
  }
}
// Запись в LS при вводе текста

function onFormInput(e) {
  formData[e.target.name] = e.target.value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  formData = JSON.parse(localStorage.getItem(STORAGE_KEY));
}

// Проверка на checked
refs.policyСheckbox.addEventListener("change", onPolicyChange);

function onPolicyChange(event) {
  refs.btn.disabled = !event.currentTarget.checked;
}
