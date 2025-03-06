import React from "react";

type Direction = "down" | "right";

interface ArrowProps {
  direction?: Direction;
  responsiveDirection?: {
    mobile?: Direction;
    desktop?: Direction;
  };
  className?: string;
}

export const Arrow: React.FC<ArrowProps> = ({
  direction = "down",
  responsiveDirection,
  className = "",
}) => {
  const getPathsForDirection = (dir: Direction) => {
    switch (dir) {
      case "down":
        return (
          <>
            <path d="M12 5v14" />
            <path d="m5 12 7 7 7-7" />
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

  // Create a reusable SVG component
  const ArrowSvg = ({
    dir,
    additionalClassName = "",
  }: {
    dir: Direction;
    additionalClassName?: string;
  }) => (
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
      className={`${additionalClassName} ${className}`}
    >
      {getPathsForDirection(dir)}
    </svg>
  );

  // If we have responsive directions, render two SVGs with different visibility
  if (responsiveDirection) {
    return (
      <div className="flex items-center justify-center">
        <ArrowSvg dir={responsiveDirection.mobile || direction} additionalClassName="md:hidden" />
        <ArrowSvg
          dir={responsiveDirection.desktop || direction}
          additionalClassName="hidden md:block"
        />
      </div>
    );
  }

  // Otherwise, render a single arrow
  return (
    <div className="flex items-center justify-center">
      <ArrowSvg dir={direction} />
    </div>
  );
};

export default Arrow;
