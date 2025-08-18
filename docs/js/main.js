// src/js/main.js

import "./hero-slider.js";
import { initScrollReveal } from "./my-scrollreveal.js";
import { initAlertBox } from "./create-alertbox.js";
import { initFooterForm } from "./footer-form.js";
import { initApplicationForm } from "./application-form.js";
import { initFormPolicy } from "./form-policy.js";

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initAlertBox();
  initFooterForm();
  initApplicationForm();
  initFormPolicy();
});
