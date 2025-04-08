import React from "react";

interface CarouselItemProps {
  workloadIdentity: string;
  veraidIdentity: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ workloadIdentity, veraidIdentity }) => {
  return (
    <div className="flex flex-col items-center font-jetBrainsMono">
      <div className="bg-neutral-900 rounded p-3">
        <div className="flex items-center gap-2">
          {/* Left box - Service account */}
          <div className="bg-neutral-800 rounded px-4 py-2 flex items-center">
            {/* Cloud icon SVG */}
            <svg className="h-6 w-6 text-white mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.5 20Q4.22 20 2.61 18.43 1 16.85 1 14.58 1 12.63 2.17 11.1 3.35 9.57 5.25 9.15 5.88 6.85 7.75 5.43 9.63 4 12 4 14.93 4 16.96 6.04 19 8.07 19 11 20.73 11.2 21.86 12.5 23 13.78 23 15.5 23 17.38 21.69 18.69 20.38 20 18.5 20Z" />
            </svg>
            <span className="text-white font-jetBrainsMono text-sm">{workloadIdentity}</span>
          </div>

          {/* Arrow */}
          <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>

          {/* Right box - Target */}
          <div className="bg-neutral-800 rounded px-4 py-1">
            <span className="text-white font-jetBrainsMono text-sm">{veraidIdentity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselItem;
