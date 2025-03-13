import { useState, useEffect } from "react";
import type { RefObject } from "react";

export function useCarouselAnimation(
  containerRef: RefObject<HTMLDivElement | null>,
  speed: number = 1.5,
  isPaused: boolean = false,
) {
  const [position, setPosition] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (containerRef.current && !isInitialized) {
      const firstChild = containerRef.current.children[0] as HTMLElement;
      if (firstChild) {
        setItemWidth(firstChild.offsetWidth);
        setIsInitialized(true);
      }
    }
  }, [isInitialized]);

  useEffect(() => {
    if (!isInitialized || itemWidth === 0) return;

    let animationId: number;
    let lastTimestamp = 0;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isPaused) {
        setPosition((prevPosition) => {
          if (Math.abs(prevPosition) >= itemWidth) {
            return 0;
          }
          return prevPosition - speed * (deltaTime / 16);
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isInitialized, itemWidth, speed, isPaused]);

  return { position, isInitialized };
}
