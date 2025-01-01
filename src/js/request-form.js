const refs = {
  form: document.querySelector(".request-form__block"),
  firstName: document.querySelector("#firstName"),
  phone: document.querySelector("#phone"),
  message: document.querySelector("#comment"),
};

const STORAGE_KEY = "feedback-form-state";
const formData = {};

refs.form.addEventListener("submit", onFormSubmit);
refs.form.addEventListener("input", onFormInput);
// populateFormOutput();

function onFormInput(e) {
  formData[e.target.name] = e.target.value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
}

function onFormSubmit(e) {
  e.preventDefault();

  e.currentTarget.reset();
  localStorage.removeItem(STORAGE_KEY);
  console.log(JSON.parse(localStorage.getItem(STORAGE_KEY)));
}

(function populateFormOutput() {
  const savedFormData = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (savedFormData) {
    console.log("Страница обновлена");

    refs.firstName.value = savedFormData.firstName;
    refs.phone.value = savedFormData.phone;
    refs.message.value = savedFormData.comment;
  }
})();
