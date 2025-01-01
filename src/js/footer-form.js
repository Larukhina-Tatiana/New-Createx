const refs = {
  form: document.querySelector(".footer__form"),
  email: document.querySelector("#email"),
};

const STORAGE_KEY = "feedback-footer-form-state";
const formData = {};

refs.form.addEventListener("submit", onFormSubmit);
// refs.form.addEventListener("input", _throttle(onFormInput, 500));
refs.form.addEventListener("input", onFormInput);

function onFormSubmit(event) {
  event.preventDefault(); //предотвращает перезагрузку(обновление страниы)

  if (event.currentTarget.elements.email.value === "") {
    alert`Поле должно быть заполнено`;
  } else {
    // // Сбор данных формы
    // const formData = new FormData(event.currentTarget);
    // formData.forEach((value, name) => {
    //   console.log(name, value);
    // });
    console.log(JSON.parse(localStorage.getItem(STORAGE_KEY)));
    refs.form.reset();
    localStorage.removeItem(STORAGE_KEY);
    const alert = document.createElement("div");
    alert.classList.add("footer-form__alert");
    alert.innerText = `Подписка оформлена!`;
    document.body.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}

function onFormInput(e) {
  console.log(e.target.value);

  formData[e.target.name] = e.target.value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
}

(function restoreFormOutput() {
  // const savedFormData = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (JSON.parse(localStorage.getItem(STORAGE_KEY))) {
    refs.email.value = JSON.parse(localStorage.getItem(STORAGE_KEY)).email;
  }
})();
