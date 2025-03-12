// Used to pause the carousel when the mouse is over it or tap on mobile
import { useState, useEffect } from "react";

export default function CarouselController() {
  const [isPaused, setPaused] = useState(false);

  useEffect(() => {
    const carousel = document.querySelector("#carousel");
    if (!carousel) return;

    if (isPaused) {
      carousel.classList.add("carousel-paused");
    } else {
      carousel.classList.remove("carousel-paused");
    }

    if (window.matchMedia("(hover: hover)").matches) {
      const handleMouseEnter = () => setPaused(true);
      const handleMouseLeave = () => setPaused(false);

      carousel.addEventListener("mouseenter", handleMouseEnter);
      carousel.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        carousel.removeEventListener("mouseenter", handleMouseEnter);
        carousel.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [isPaused]);

  useEffect(() => {
    const carousel = document.querySelector("#carousel");
    if (!carousel) return;

    const handleClick = () => setPaused((prev) => !prev);
    carousel.addEventListener("click", handleClick);

    return () => {
      carousel.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
