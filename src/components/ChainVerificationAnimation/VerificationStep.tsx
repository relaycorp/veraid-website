import React from "react";
import { Arrow } from "./Arrow";
import { VerificationStatus } from "./VerificationStatus";
import "./BorderAnimation.css";

export interface VerificationStepProps {
  title: string;
  description?: string;
  showArrow?: boolean;
  status: VerificationStatus;
  progress?: number;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  title,
  description,
  showArrow = false,
  status = VerificationStatus.PENDING,
  progress = status === VerificationStatus.VERIFIED ? 1 : 0,
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

  const animationDuration = "1s";

  const customStyle =
    status === VerificationStatus.VERIFYING
      ? ({
          "--animation-duration": animationDuration,
          "--progress": progress,
        } as React.CSSProperties)
      : {};

  return (
    <div className="relative">
      {status === VerificationStatus.VERIFYING ? (
        <div className="relative">
          <div
            className={`rounded-md ${status === VerificationStatus.VERIFYING ? "border-conic border-conic--animated" : `${borderClasses} ${getBorderColorClass()}`} p-1 lg:p-2 text-white`}
            style={customStyle}
          >
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
