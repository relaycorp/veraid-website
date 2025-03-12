// Used to pause the carousel when the mouse is over it or tap on mobile
import { useState, useEffect } from "react";

export default function PauseController() {
  const [isPaused, setPaused] = useState(false);

  useEffect(() => {
    const carousel = document.querySelector("#carousel");
    if (!carousel) return;

    if (isPaused) {
      carousel.classList.add("carousel-paused");
    } else {
      carousel.classList.remove("carousel-paused");
    }

    const handleMouseEnter = () => setPaused(true);
    const handleMouseLeave = () => setPaused(false);
    const handleClick = () => setPaused((prev) => !prev);

    if (window.matchMedia("(hover: hover)").matches) {
      carousel.addEventListener("mouseenter", handleMouseEnter);
      carousel.addEventListener("mouseleave", handleMouseLeave);
    }

    carousel.addEventListener("click", handleClick);

    return () => {
      carousel.removeEventListener("mouseenter", handleMouseEnter);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
      carousel.removeEventListener("click", handleClick);
    };
  }, [isPaused]);

  return <span className="sr-only">Carousel controller</span>;
}
