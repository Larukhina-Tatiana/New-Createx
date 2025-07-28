document.addEventListener("DOMContentLoaded", function () {
  const shakeDuration = 1200;
  const shakeInterval = 3000;

  const elements = document.querySelectorAll(".animate-on-scroll");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function setupShakeLoop(el) {
    if (prefersReducedMotion) return;
    if (el.dataset.shaking === "true") return;

    el.dataset.shaking = "true";

    const intervalId = setInterval(() => {
      el.classList.add("shake-loop");
      setTimeout(() => el.classList.remove("shake-loop"), shakeDuration);
    }, shakeInterval);

    el.dataset.shakeInterval = intervalId;
  }

  function clearShakeLoop(el) {
    const id = el.dataset.shakeInterval;
    if (id) clearInterval(id);
    delete el.dataset.shakeInterval;
    delete el.dataset.shaking;
    el.classList.remove("shake-loop");
  }

  function handleVisibilityChange(el, isVisible) {
    const isShake = el.classList.contains("shake");

    if (isVisible) {
      el.classList.add("in-view");
      if (isShake) setupShakeLoop(el);
    } else {
      el.classList.remove("in-view");
      if (isShake) clearShakeLoop(el);
    }
  }

  // 👇 Используем IntersectionObserver, если доступен
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          handleVisibilityChange(entry.target, entry.isIntersecting);
        });
      },
      {
        root: null,
        threshold: 0.2,
      }
    );

    elements.forEach((el) => observer.observe(el));
  } else {
    // 🧯 Fallback для старых устройств
    function fallbackCheckVisibility() {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const visible = rect.top <= window.innerHeight && rect.bottom >= 0;
        handleVisibilityChange(el, visible);
      });
    }

    window.addEventListener("scroll", fallbackCheckVisibility);
    window.addEventListener("resize", fallbackCheckVisibility);
    fallbackCheckVisibility(); // сразу проверить при загрузке
  }
});
