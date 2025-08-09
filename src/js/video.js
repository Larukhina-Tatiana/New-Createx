const videoBlock = document.querySelector(".video__block");

if (videoBlock) {
  const video = videoBlock.querySelector("video");
  const playBtn = videoBlock.querySelector(".video__button");

  if (video && playBtn) {
    let saveInterval;

    function playVideo(startFromBeginning = false) {
      if (startFromBeginning || video.ended) {
        video.currentTime = 0;
      } else {
        const savedTime = localStorage.getItem("videoplayer-current-time");
        if (savedTime) {
          video.currentTime = parseFloat(savedTime);
        }
      }

      video.play();
      video.controls = true;
      videoBlock.classList.add("video__block--played");
      playBtn.classList.add("video__button--played");
      playBtn.setAttribute("aria-pressed", "true");
      playBtn.style.display = "none";

      saveInterval = setInterval(() => {
        localStorage.setItem("videoplayer-current-time", video.currentTime);
      }, 5000);
    }

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

    function resetVideoProgress() {
      localStorage.removeItem("videoplayer-current-time");
    }

    // Клик по кастомной кнопке
    playBtn.addEventListener("click", () => {
      playVideo(video.ended);
    });

    // Клик по видео — пауза
    video.addEventListener("click", () => {
      if (!video.paused) {
        pauseVideo();
      }
    });

    // Пауза по событию
    video.addEventListener("pause", pauseVideo);

    // По завершению сбросить прогресс
    video.addEventListener("ended", () => {
      resetVideoProgress();
      playBtn.style.display = "block";
      playBtn.classList.remove("video__button--played");
      video.controls = false;
    });

    // Сохраняем прогресс при уходе
    window.addEventListener("beforeunload", () => {
      if (!video.ended) {
        localStorage.setItem("videoplayer-current-time", video.currentTime);
      }
    });
  }
}
