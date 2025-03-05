import React from "react";
import { Arrow } from "./Arrow";
import { VerificationStatus } from "./VerificationStatus";

export interface VerificationStepProps {
  title: string;
  description?: string;
  showArrow?: boolean;
  status: VerificationStatus;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  title,
  description,
  showArrow = false,
  status = VerificationStatus.PENDING,
}) => {
  const getBorderClass = () => {
    if (status === VerificationStatus.VERIFIED) {
      return "border-2 lg:border-3 border-green-500 rounded-md";
    }
    return "border-2 lg:border-3 border-amber-500 rounded-md";
  };

  return (
    <div className="relative">
      {status === VerificationStatus.VERIFYING ? (
        <div className="relative">
          <div className="w-full rounded-md p-1 lg:p-3 text-white">
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

      {showArrow && <Arrow direction="down" className="text-white" />}
    </div>
  );
};

export default VerificationStep;
