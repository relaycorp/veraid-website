import React from "react";
import { Arrow } from "./Arrow";

export interface VerificationStepProps {
  title: string;
  description?: string;
  showArrow?: boolean;
  isVerifying?: boolean;
  isVerified?: boolean;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  title,
  description,
  showArrow = false,
  isVerifying = false,
  isVerified = false,
}) => {
  // Determine the border class based on verification state
  const getBorderClass = () => {
    if (isVerified) {
      return "border-2 lg:border-3 border-green-500 rounded-md";
    }
    return "border-2 lg:border-3 border-amber-500 rounded-md";
  };

  return (
    <div className="relative">
      {isVerifying ? (
        <div className="relative">
          {/* Animated gradient border using the Cruip approach */}
          <div className="w-full rounded-md animate-border [background:linear-gradient(45deg,#000,#000_50%,#000)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.amber.500/.48)_20%,theme(colors.green.500)_30%,theme(colors.green.300)_40%,theme(colors.green.500)_50%,theme(colors.amber.500/.48)_60%)_border-box] border-2 lg:border-3 border-transparent p-1 lg:p-3 text-white">
            <div className="font-mono">
              <div className="font-bold text-xs lg:text-sm">{title}</div>
              <div className="hidden md:block text-xs lg:text-sm text-gray-300">{description}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${getBorderClass()} p-1 lg:p-3 text-white`}>
          <div className="font-mono">
            <div className="font-bold text-xs lg:text-sm">{title}</div>
            <div className="hidden md:block text-xs lg:text-sm text-gray-300">{description}</div>
          </div>
        </div>
      )}

      {/* Arrow component */}
      {showArrow && <Arrow direction="down" className="text-white" />}
    </div>
  );
};

export default VerificationStep;
