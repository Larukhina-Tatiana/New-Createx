const refs = {
  form: document.querySelector(".contact-form"),
  textarea: document.querySelector(".form__textarea"),
  policyСheckbox: document.querySelector("#policy"),
  btn: document.querySelector(".contact-form button"),
};
const radioAll = refs.form.contactMetod;
const countRadioElement = refs.form.contactMetod.length;
const textarea = refs.form.comment;

let textError = "";
let formData = {};
const STORAGE_KEY = "feedback-contact-form-state";

refs.form.addEventListener("submit", onFormSubmit);
refs.form.addEventListener("input", onFormInput);

// populateFormOutput();

function onFormSubmit(e) {
  e.preventDefault();

  if (validationForm(refs.form) && validRadio(radioAll)) {
    alert("Форма проверена");
    const formData = new FormData(refs.form);
    console.log(Object.fromEntries(formData));
    // Очистка LS
    e.currentTarget.reset();
    localStorage.removeItem(STORAGE_KEY);
  } else {
    e.preventDefault();
    alert("Форма не прошла валидацию");
  }
}

function validationForm(form) {
  const inputAll = form.querySelectorAll("[data-required]");
  console.log(inputAll);
  let formFalse = 0;
  inputAll.forEach((input) => {
    const inputValue = input.value;
    const inputReg = input.getAttribute("data-reg");
    const reg = new RegExp(inputReg);
    // console.log(inputValue, reg);

    if (reg.test(inputValue) !== true) {
      formFalse += 1;
      console.log(formFalse);

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
    }
  });
  return formFalse >= 1 ? false : true;
}

// Проверка radio
function validRadio(radioAll) {
  // console.log("Проверка Radio");
  let inValidRadio = false;
  let inFalse = 0;

  for (let index = 0; index < countRadioElement; index++) {
    if (radioAll[index].checked === false) {
      inFalse += 1;
    } else {
      inValidRadio = true;
      // console.log(inValidRadio);
      return inValidRadio;
    }

    if (inFalse === countRadioElement) {
      const parentDiv = radioAll[0].closest(".form__fields-inner");

      parentDiv.style.boxShadow = "0 0 4px rgb(255, 0, 0)";
      parentDiv.addEventListener("focus", function (event) {
        parentDiv.style.boxShadow = "";
        // console.log(inValidRadio);
      });
    }
  }
}

function onTextError(inputError) {
  if (inputError === "first-name") {
    textError = "Incorrect name, enter name without spaces!";
    return;
  }
  if (inputError === "phone") {
    textError = "Incorrect phone number!";
    return;
  }
  if (inputError === "e-mail") {
    textError = "Incorrect email!";
    return;
  }
  if (inputError === "comment") {
    textError = "Incorrect Message!";
    return;
  }
}

// Запись в LS при вводе текста

// function onTextareaInput(e) {
//   const message = e.target.value;
//   localStorage.setItem(STORAGE_KEY, message);
// }

// Проверка на checked
refs.policyСheckbox.addEventListener("change", onPolicyChange);

function onPolicyChange(event) {
  refs.btn.disabled = !event.currentTarget.checked;
}

function onFormInput(e) {
  console.log(e.target.value);

  formData[e.target.name] = e.target.value.trim();
  // console.log((formData[e.target.name] = e.target.value.trim()));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  formData = JSON.parse(localStorage.getItem(STORAGE_KEY));
}

// Возврат из LS при обновлении страницы
(function populateFormOutput() {
  // console.log("Форма проверяется");

  // const savedFormData = JSON.parse(localStorage.getItem(STORAGE_KEY));

  // if (savedFormData) {
  //   Object.entries(savedFormData).forEach(([name, value]) => {
  //     refs.form.elements[name].value = value.trim();
  //   });
  // }
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
})();
