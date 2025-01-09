const refs = {
  form: document.querySelector(".contact-form"),
  // firstName: document.querySelector("#first-name"),
  // phone: document.querySelector("#phone"),
  // email: document.querySelector("#e-mail"),
  textarea: document.querySelector(".form__textarea"),
  policyСheckbox: document.querySelector("#policy"),
  btn: document.querySelector(".contact-form button"),
};

const textarea = refs.form.comment;

let textError = "";
const formData = {};
const STORAGE_KEY = "feedback-contact-form-state";

refs.form.addEventListener("submit", onFormSubmit);
refs.form.addEventListener("input", onFormInput);

populateFormOutput();

function onFormSubmit(e) {
  e.preventDefault();

  if (validationForm(refs.form) === true) {
    alert("Форма проверена");
    // Сбор данных формы
    // const formData = new FormData(e.currentTarget);
    // formData.forEach((value, name) => {
    //   console.log(name, value);
    // });
    // Способ 2
    const formData = new FormData(refs.form);
    console.log(Object.fromEntries(formData));
    // Object.entries(savedFormData).forEach(([name, value]) => {
    //   refs.form.elements[name].value = value.trim();
    // });

    // Очистка LS
    e.currentTarget.reset();
    localStorage.removeItem(STORAGE_KEY);
  } else {
    e.preventDefault();
    // alert("Форма не прошла вылидацию");
  }
}

let result = true;
function validationForm(form) {
  const inputAll = form.querySelectorAll("[data-required]");
  console.log(inputAll);

  inputAll.forEach((input) => {
    validRadio();
    const inputValue = input.value;
    const inputReg = input.getAttribute("data-reg");
    const reg = new RegExp(inputReg);
    console.log(inputValue, reg);

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
  console.log(result);

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
    textError = "Incorrect Message!";
  }
  return textError;
}

// Возврат из LS при обновлении страницы
function populateFormOutput() {
  const savedFormData = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (savedFormData) {
    Object.entries(savedFormData).forEach(([name, value]) => {
      refs.form.elements[name].value = value.trim();
    });
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
  console.log((formData[e.target.name] = e.target.value.trim()));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  console.log(JSON.stringify(formData));
}

// Проверка radio

function validRadio() {
  console.log("Проверка Radio");

  const radioAll = refs.form.contactMetod;
  console.log(radioAll);

  let inFalse = 0;
  for (let index = 0; index < radioAll.length; index++) {
    if (radioAll[index].checked === false) inFalse += 1;
    if (inFalse === radioAll.length) {
      result = false;
      console.log(result);

      const parentDiv = radioAll[0].closest(".form__fields-inner");
      // parentDiv
      //   .closest("fieldset")
      //   .insertAdjacentHTML(
      //     "beforeend",
      //     `<div class="form__error">Select your preferred method of communication</div>`
      //   );
      parentDiv.style.boxShadow = "0 0 4px rgb(255, 0, 0)";

      parentDiv.addEventListener("focus", function (event) {
        // if (input.nextElementSibling) {
        //   input.nextElementSibling.remove();
        parentDiv.style.boxShadow = "";
        // }
        console.log(result);
      });
    } else {
      result = true;
    }
  }
}
