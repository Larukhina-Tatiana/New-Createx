const videoBlock = document.querySelector(".video-block");

if (videoBlock) {
  const video = videoBlock.querySelector("video");
  const playBtn = videoBlock.querySelector(".video__button");
  console.log(playBtn);

  playBtn.addEventListener("click", () => {
    videoBlock.classList.add("video-block--played");
    video.play();
    video.controls = true;
    playBtn.classList.add("video__button--played");
  });

  video.onpause = function () {
    videoBlock.classList.remove("video-block--played");
    video.controls = false;
    playBtn.classList.remove("video__button--played");
  };
}
