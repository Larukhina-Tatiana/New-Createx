function createAlertBox(form) {
  let alertBox = document.createElement("div");
  alertBox.classList.add("form-alert");
  alertBox.innerText = `Subscription completed!`;
  form.appendChild(alertBox);
  setTimeout(() => {
    alertBox.remove();
  }, 3000);
}
