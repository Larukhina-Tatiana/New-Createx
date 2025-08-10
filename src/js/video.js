const videoBlock = document.querySelector(".video__block");

if (videoBlock) {
  const video = document.querySelector("video");

  video.addEventListener("canplay", () => {
    video.controls = true; // включаем до play()
    video.muted = false;
  });

  const playBtn = videoBlock.querySelector(".video__button");

  if (video && playBtn) {
    let saveInterval;

    // ▶️ Запуск видео с восстановлением прогресса
    function playVideo(startFromBeginning = false) {
      if (startFromBeginning || video.ended) {
        video.currentTime = 0;
      } else {
        const savedTime = localStorage.getItem("videoplayer-current-time");
        if (savedTime) {
          video.currentTime = parseFloat(savedTime);
        }
      }

      // Попытка воспроизведения с обработкой ошибок
      video
        .play()
        .then(() => {
          video.controls = true;
          videoBlock.classList.add("video__block--played");
          playBtn.classList.add("video__button--played");
          playBtn.setAttribute("aria-pressed", "true");
          playBtn.style.display = "none";

          // ⏱️ Сохраняем прогресс каждые 5 секунд
          saveInterval = setInterval(() => {
            localStorage.setItem("videoplayer-current-time", video.currentTime);
          }, 5000);
        })
        .catch((err) => {
          console.warn("⛔️ Не удалось запустить видео:", err);
        });
    }

    // ⏸️ Пауза и возврат кнопки
    function pauseVideo() {
      video.pause();
      video.controls = false;
      videoBlock.classList.remove("video__block--played");
      playBtn.classList.remove("video__button--played");
      playBtn.setAttribute("aria-pressed", "false");
      playBtn.style.display = "block";

      clearInterval(saveInterval);
      localStorage.setItem("videoplayer-current-time", video.currentTime);
    }

    // 🔄 Сброс прогресса при завершении
    function resetVideoProgress() {
      localStorage.removeItem("videoplayer-current-time");
    }

    // ▶️ Клик по кастомной кнопке запускает видео
    playBtn.addEventListener("click", () => {
      try {
        video.muted = false; // обязательно выключить mute
        video.currentTime = 0; // или восстановить savedTime
        video.play(); // строго внутри click
        video.controls = true;
        videoBlock.classList.add("video__block--played");
        playBtn.classList.add("video__button--played");
        playBtn.setAttribute("aria-pressed", "true");
        playBtn.style.display = "none";

        saveInterval = setInterval(() => {
          localStorage.setItem("videoplayer-current-time", video.currentTime);
        }, 5000);
      } catch (err) {
        console.warn("Firefox блокирует воспроизведение:", err);
      }
    });

    // ⏸️ Клик по видео — пауза
    video.addEventListener("click", () => {
      if (!video.paused) {
        pauseVideo();
      }
    });

    // ⏸️ Обработка события паузы
    video.addEventListener("pause", pauseVideo);

    // 🛑 Завершение видео — сброс состояния
    video.addEventListener("ended", () => {
      resetVideoProgress();
      playBtn.style.display = "block";
      playBtn.classList.remove("video__button--played");
      video.controls = false;
    });

    // 💾 Сохраняем прогресс при уходе со страницы
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden" && !video.ended) {
        localStorage.setItem("videoplayer-current-time", video.currentTime);
      }
    });
  }
}
