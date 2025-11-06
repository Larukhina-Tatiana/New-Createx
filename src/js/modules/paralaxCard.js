document.querySelectorAll(".animate-wrap").forEach((wrap) => {
  const card = wrap.querySelector(".animate-card");
  const bg = wrap.querySelector(".animate-bg");

  let width = wrap.offsetWidth;
  let height = wrap.offsetHeight;
  let mouseLeaveDelay;

  wrap.addEventListener("mousemove", (e) => {
    const rect = wrap.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const mousePX = mouseX / width;
    const mousePY = mouseY / height;

    const rX = mousePX * 30;
    const rY = mousePY * -30;
    const tX = mousePX * -40;
    const tY = mousePY * -40;

    card.style.transform = `rotateY(${rX}deg) rotateX(${rY}deg)`;
    bg.style.transform = `translateX(${tX}px) translateY(${tY}px)`;
  });

  wrap.addEventListener("mouseleave", () => {
    mouseLeaveDelay = setTimeout(() => {
      card.style.transform = `rotateY(0deg) rotateX(0deg)`;
      bg.style.transform = `translateX(0px) translateY(0px)`;
    }, 1000);
  });

  wrap.addEventListener("mouseenter", () => {
    clearTimeout(mouseLeaveDelay);
  });
});
