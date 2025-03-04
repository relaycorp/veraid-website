import React from "react";

export interface VerificationStepProps {
  title: string;
  description: string;
  showArrow?: boolean;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  title,
  description,
  showArrow = false,
}) => {
  return (
    <div className="mb-2 relative">
      <div className="border-3 border-amber-500 rounded-md p-4 text-white">
        <div className="font-mono">
          <div className="font-bold text-sm">{title}</div>
          <div className="text-sm text-gray-300">{description}</div>
        </div>
      </div>
      {showArrow && (
        <div className="flex justify-center my-1">
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
            className="text-white"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default VerificationStep;
