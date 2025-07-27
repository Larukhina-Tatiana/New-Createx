const videoBlock = document.querySelector(".video__block");

if (videoBlock) {
  const video = videoBlock.querySelector("video");
  const playBtn = videoBlock.querySelector(".video__button");

  if (video && playBtn) {
    let saveInterval;

    function playVideo() {
      const savedTime = localStorage.getItem("videoplayer-current-time");
      if (savedTime) {
        video.currentTime = parseFloat(savedTime);
      }
      video.play();
      video.controls = true;
      videoBlock.classList.add("video__block--played");
      playBtn.classList.add("video__button--played");
      playBtn.setAttribute("aria-pressed", "true");

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
      clearInterval(saveInterval);
      localStorage.setItem("videoplayer-current-time", video.currentTime);
    }

    playBtn.addEventListener("click", playVideo);

    video.addEventListener("click", () => {
      video.paused ? playVideo() : pauseVideo();
    });

    video.addEventListener("pause", pauseVideo);

    window.addEventListener("beforeunload", () => {
      localStorage.setItem("videoplayer-current-time", video.currentTime);
    });
  }
}
