import React from "react";

interface ArrowProps {
  direction?: "up" | "down" | "left" | "right";
  responsiveDirection?: {
    mobile?: "up" | "down" | "left" | "right";
    desktop?: "up" | "down" | "left" | "right";
  };
  className?: string;
}

export const Arrow: React.FC<ArrowProps> = ({
  direction = "down",
  responsiveDirection,
  className = "",
}) => {
  const getPathsForDirection = (dir: "up" | "down" | "left" | "right") => {
    switch (dir) {
      case "up":
        return (
          <>
            <path d="M12 19v-14" />
            <path d="m5 12 7-7 7 7" />
          </>
        );
      case "down":
        return (
          <>
            <path d="M12 5v14" />
            <path d="m5 12 7 7 7-7" />
          </>
        );
      case "left":
        return (
          <>
            <path d="M19 12h-14" />
            <path d="m12 5-7 7 7 7" />
          </>
        );
      case "right":
        return (
          <>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </>
        );
    }
  };

  // If we have responsive directions, render two SVGs with different visibility
  if (responsiveDirection) {
    return (
      <div className="flex items-center justify-center">
        {/* Mobile arrow */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`md:hidden ${className}`}
        >
          {getPathsForDirection(responsiveDirection.mobile || direction)}
        </svg>

        {/* Desktop arrow */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`hidden md:block ${className}`}
        >
          {getPathsForDirection(responsiveDirection.desktop || direction)}
        </svg>
      </div>
    );
  }

  // Otherwise, render a single arrow
  return (
    <div className="flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        {getPathsForDirection(direction)}
      </svg>
    </div>
  );
};

export default Arrow;
