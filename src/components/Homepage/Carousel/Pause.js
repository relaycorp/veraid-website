// Used to pause the carousel when the mouse is over it or tap on mobile
const carousel = document.getElementById("carousel");
let isPaused = false;

const mediaQuery = window.matchMedia("(hover: hover)");
if (mediaQuery.matches) {
  carousel?.addEventListener("mouseenter", () => {
    carousel.classList.add("carousel-paused");
  });

  carousel?.addEventListener("mouseleave", () => {
    carousel.classList.remove("carousel-paused");
  });
}

carousel?.addEventListener("click", () => {
  isPaused = !isPaused;
  carousel.classList.toggle("carousel-paused", isPaused);
});
