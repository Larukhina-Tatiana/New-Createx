const refs = {
  form: document.querySelector(".application-form__form"),
  // firstName: document.querySelector("#first-name"),
  // phone: document.querySelector("#phone"),
  // email: document.querySelector("#e-mail"),
  // message: document.querySelector(".application-form__form textarea"),
  policyСheckbox: document.querySelector("#policy"),
  btn: document.querySelector(".application-form__form button"),
};

refs.policyСheckbox.addEventListener("change", onPolicyChange);
const STORAGE_KEY = "feedback-application-form-state";
let formData = {};

refs.form.addEventListener("submit", onFormSubmit);
refs.form.addEventListener("input", inputHandler);
// refs.form.addEventListener("input", onFormInput);
populateFormOutput();
function onPolicyChange(event) {
  refs.btn.disabled = !event.currentTarget.checked;
}

// function onFormInput(e) {
//   inputHandler();
//   formData[e.target.name] = e.target.value;
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
// }

function onFormSubmit(e) {
  e.preventDefault();
  console.log(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  e.currentTarget.reset();
  localStorage.removeItem(STORAGE_KEY);
}

function populateFormOutput() {
  let savedFormData = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (savedFormData) {
    Object.entries(savedFormData).forEach(([name, value]) => {
      refs.form.elements[name].value = value;
    });
  }
}

function inputHandler({ target }) {
  if (target.hasAttribute("data-reg")) {
    inputCheck(target);
  }
}

function inputCheck(elements) {
  const inputValue = elements.value;
  const inputReg = elements.getAttribute("data-reg");
  const reg = new RegExp(inputReg);
  console.log(inputValue, reg);
  if (reg.test(inputValue)) {
    console.log(elements);
    console.log(elements.target);
    elements.style.border = "2px solid rgb(0,196,0)";
    // onFormInput();
    console.log(e.target);
  } else {
    elements.style.border = "2px solid rgb(255, 0, 0)";
  }
}
