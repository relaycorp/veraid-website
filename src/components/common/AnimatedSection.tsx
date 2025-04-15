import React, { useEffect, useRef, useState } from "react";

type AnimationType = "SlideUp" | "Scale";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  animationType?: AnimationType;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  id,
  animationType = "SlideUp",
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionId = id || `animated-section-${Math.random().toString(36).substr(2, 9)}`;
    const localStorageKey = `section-animated-${sectionId}`;

    const hasBeenAnimated = localStorage.getItem(localStorageKey) === "true";

    if (hasBeenAnimated) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);

            localStorage.setItem(localStorageKey, "true");
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [delay, hasAnimated, id]);

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? `opacity-100 ${animationType === "SlideUp" ? "translate-y-0" : "scale-100"}`
          : `opacity-0 ${animationType === "SlideUp" ? "translate-y-8" : "scale-75"}`
      } ${className}`}
    >
      {children}
    </div>
  );
}
