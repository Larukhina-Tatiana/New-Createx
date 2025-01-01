const videoBlock = document.querySelector(".video__block");

if (videoBlock) {
  const video = videoBlock.querySelector("video");

  const playBtn = videoBlock.querySelector(".video__button");
  console.log(playBtn);
  console.dir(video);
  console.log(video.currentTime);

  const getCurrentTimeUpdate = localStorage.getItem("videoplayer-current-time");
  console.log(getCurrentTimeUpdate);
  playBtn.addEventListener("click", () => {
    videoBlock.classList.add("video__block--played");
    video.play(getCurrentTimeUpdate);

    // video.play();
    video.focus();
    video.controls = true;
    playBtn.classList.add("video__button--played");
  });

  video.onpause = function () {
    let videoplayerCurrentTime = video.currentTime;
    console.log(videoplayerCurrentTime);
    localStorage.setItem("videoplayer-current-time", videoplayerCurrentTime);
    const getCurrentTimeUpdate = localStorage.getItem(
      "videoplayer-current-time"
    );
    console.log(getCurrentTimeUpdate);

    videoBlock.classList.remove("video__block--played");
    video.controls = false;
    playBtn.classList.remove("video__button--played");
  };
}
