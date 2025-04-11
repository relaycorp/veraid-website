import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type AnimationType = "fade-in" | "slide-up" | "slide-left" | "slide-right" | "scale-up";
type DurationType = "fast" | "normal" | "slow";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: AnimationType;
  duration?: DurationType;
  delay?: number;
  threshold?: number;
  once?: boolean;
  id?: string;
}

export const AnimatedSection = ({
  children,
  animation = "fade-in",
  duration = "normal",
  delay = 0,
  threshold = 0.1,
  once = true,
  id = crypto.randomUUID(),
}: AnimatedSectionProps) => {
  const [ref, inView] = useInView({ threshold, triggerOnce: once });
  const [hasAnimated, setHasAnimated] = useState(false);

  const durations: Record<DurationType, string> = {
    fast: "duration-300",
    normal: "duration-500",
    slow: "duration-700",
  };

  // Check if this animation has already played in this session
  useEffect(() => {
    const animated = localStorage.getItem(`animated-${id}`);
    if (animated) {
      setHasAnimated(true);
    }
  }, [id]);

  // Save animation state when it plays
  useEffect(() => {
    if (inView && !hasAnimated && once) {
      localStorage.setItem(`animated-${id}`, "true");
      setHasAnimated(true);
    }
  }, [inView, hasAnimated, id, once]);

  const shouldShow = inView || hasAnimated;

  // Determine transform based on animation type
  const getTransform = () => {
    if (!shouldShow) {
      switch (animation) {
        case "slide-up":
          return "translateY(2rem)";
        case "slide-left":
          return "translateX(2rem)";
        case "slide-right":
          return "translateX(-2rem)";
        case "scale-up":
          return "scale(0.95)";
        default:
          return "none";
      }
    }
    return "translate(0, 0) scale(1)";
  };

  return (
    <div ref={ref} className="animated-section-wrapper">
      <div
        className={`transition transform ${durations[duration]}`}
        style={{
          transitionDelay: `${delay}ms`,
          opacity: shouldShow ? 1 : 0,
          transform: getTransform(),
          willChange: "opacity, transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};
