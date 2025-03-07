import React from "react";
import { Arrow } from "./Arrow";
import { VerificationStatus } from "./VerificationStatus";
import "./BorderAnimation.css";

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
  const getBorderColorClass = () => {
    if (status === VerificationStatus.VERIFIED) {
      return "border-green-500";
    }
    return "border-amber-500";
  };

  // Common style classes
  const commonClasses = "p-1 lg:p-2 text-white";
  const borderClasses = "border-3 rounded-md";
  const fontContainerClasses = "font-mono";
  const titleClasses = "font-bold text-xs lg:text-sm";
  const descriptionClasses = "hidden md:block text-xs lg:text-sm text-gray-300";

  return (
    <div className="relative">
      {status === VerificationStatus.VERIFYING ? (
        <div className="relative">
          <div className={`rounded-md border-fill p-1 lg:p-2 text-white`}>
            <div className={fontContainerClasses}>
              <div className={titleClasses}>{title}</div>
              <div className={descriptionClasses}>{description}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${borderClasses} ${getBorderColorClass()} ${commonClasses}`}>
          <div className={fontContainerClasses}>
            <div className={titleClasses}>{title}</div>
            <div className={descriptionClasses}>{description}</div>
          </div>
        </div>
      )}

      {showArrow && <Arrow direction="down" className="text-white" />}
    </div>
  );
};

export default VerificationStep;
