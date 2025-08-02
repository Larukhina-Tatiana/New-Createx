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

// Анимация появления вакансий position.html -> vacancies

// Не повторяющаяся при скролле
// document.addEventListener("DOMContentLoaded", () => {
//   const appearanceEls = document.querySelectorAll("[class*='appearance-']");

//   const observer = new IntersectionObserver(
//     (entries, obs) => {
//       entries.forEach((entry, i) => {
//         if (entry.isIntersecting) {
//           const el = entry.target;
//           el.classList.add("visible");
//           el.style.animationDelay = `${i * 0.4}s`;
//           obs.unobserve(el);
//         }
//       });
//     },
//     { threshold: 0.2 }
//   );

//   appearanceEls.forEach((el) => observer.observe(el));
// });

//  Повторяющаяся при скроле
// document.addEventListener("DOMContentLoaded", () => {
//   const appearanceEls = document.querySelectorAll("[class*='appearance-']");

//   const observer = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry, i) => {
//         const el = entry.target;

//         if (entry.isIntersecting) {
//           el.classList.add("visible");
//           el.style.animationDelay = `${0.2 + i * 0.6}s`;
//         } else {
//           el.classList.remove("visible"); // повторная активация при скролле
//           // el.style.animationDelay = "0s"; // сброс задержки, если нужно
//         }
//       });
//     },
//     { threshold: 0.2 }
//   );

//   appearanceEls.forEach((el) => observer.observe(el));
// });
// следующая анимация  по окончанию предыдущей
document.addEventListener("DOMContentLoaded", () => {
  let appearanceEls = [...document.querySelectorAll("[class*='appearance-']")];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          observer.unobserve(el); // чтобы не запускать повторно

          const animateType = el.dataset.animate;
          const delayAttr = el.dataset.delay;

          const index = appearanceEls.indexOf(el);

          let delay = 0;

          if (animateType === "sync") {
            delay = 0;
          } else if (animateType === "chain") {
            delay = 0.2 + index * 0.3;
          } else if (animateType === "delay" && delayAttr) {
            delay = parseFloat(delayAttr);
          }

          el.style.animationDelay = `${delay}s`;
          el.classList.add("visible");

          // для последовательной активации (если sequential)
          if (animateType === "chain") {
            el.addEventListener(
              "animationend",
              () => {
                const nextEl = appearanceEls[index + 1];
                if (nextEl && !nextEl.classList.contains("visible")) {
                  nextEl.classList.add("visible");
                }
              },
              { once: true }
            );
          }
        } else {
          el.classList.remove("visible");
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  const observeAll = () => {
    appearanceEls.forEach((el) => observer.observe(el));
  };

  observeAll();

  window.addEventListener("resize", () => {
    appearanceEls = [...document.querySelectorAll("[class*='appearance-']")];
    observeAll();
  });
});
