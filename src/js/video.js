const videoBlock = document.querySelector(".video__block");

if (videoBlock) {
  const video = videoBlock.querySelector("video");
  const playBtn = videoBlock.querySelector(".video__button");

  // Получаем сохранённое время
  const savedTime = localStorage.getItem("videoplayer-current-time");

  playBtn.addEventListener("click", () => {
    videoBlock.classList.add("video__block--played");
    if (savedTime) {
      video.currentTime = parseFloat(savedTime);
    }
    video.play();
    video.focus();
    video.controls = true;
    playBtn.classList.add("video__button--played");
  });

  video.onpause = function () {
    localStorage.setItem("videoplayer-current-time", video.currentTime);
    videoBlock.classList.remove("video__block--played");
    video.controls = false;
    playBtn.classList.remove("video__button--played");
  };
}
