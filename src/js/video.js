const videoBlock = document.querySelector(".video__block");

if (videoBlock) {
  const video = videoBlock.querySelector("video");
  const playBtn = videoBlock.querySelector(".video__button");
  console.log(playBtn);

  playBtn.addEventListener("click", () => {
    videoBlock.classList.add("video__block--played");
    video.play();
    video.focus();
    video.controls = true;
    playBtn.classList.add("video__button--played");
  });

  video.onpause = function () {
    videoBlock.classList.remove("video__block--played");
    video.controls = false;
    playBtn.classList.remove("video__button--played");
  };
}
