import { createAlertBox } from "./create-alertbox.js";
if (document.querySelector(".request-form")) {
  const refs = {
    form: document.querySelector(".request-form__block"),
    firstName: document.querySelector("#firstName"),
    phone: document.querySelector("#phone"),
    message: document.querySelector("#message"),
  };

  const STORAGE_KEY = "feedback-form-state";
  let formData = {};

  refs.form.addEventListener("submit", onFormSubmit);
  refs.form.addEventListener("input", onFormInput);
  // populateFormOutput();

  function onFormInput(e) {
    formData[e.target.name] = e.target.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }

  function onFormSubmit(e) {
    e.preventDefault();

    console.log(JSON.parse(localStorage.getItem(STORAGE_KEY)));
    e.currentTarget.reset();
    localStorage.removeItem(STORAGE_KEY);
    createAlertBox(refs.form);
  }

  (function populateFormOutput() {
    const savedFormData = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (savedFormData) {
      console.log("Страница обновлена");

      refs.firstName.value = savedFormData.firstName;
      refs.phone.value = savedFormData.phone;
      refs.message.value = savedFormData.message;
    }
  })();
}
