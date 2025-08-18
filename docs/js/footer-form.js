import { createAlertBox } from "./create-alertbox.js";

const refs = {
  form: document.querySelector(".footer__form"),
  email: document.querySelector("#user-email"),
};
if (!refs.form) {
  console.warn("Footer form отсутсвует");
} else {

const STORAGE_KEY = "feedback-footer-form-state";
let formData = {};
refs.form.addEventListener("submit", onFormSubmit);
// refs.form.addEventListener("input", _throttle(onFormInput, 500));
refs.form.addEventListener("input", onFormInput);

function onFormSubmit(event) {
  event.preventDefault(); //предотвращает перезагрузку(обновление страниы)

  console.log(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  refs.form.reset();
  localStorage.removeItem(STORAGE_KEY);

  createAlertBox(refs.form);
}

function onFormInput(e) {
  console.log(e.target.value);

  formData[e.target.name] = e.target.value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
}

(function restoreFormOutput() {
  const savedFormData = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (savedFormData) {
    console.log("Страница обновлена");
    refs.email.value = JSON.parse(localStorage.getItem(STORAGE_KEY)).email;
  }
})();
}
