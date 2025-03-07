import React from "react";
import VerificationStep from "./VerificationStep";
import TickIcon from "../../assets/icons/tick.svg?raw";
import { VerificationStatus } from "./VerificationStatus";
import "./BorderAnimation.css";

export interface VerificationStepData {
  title: string;
  description?: string;
  showArrow?: boolean;
}

interface PhaseProps {
  title: string;
  steps: VerificationStepData[];
  result: string;
  status: VerificationStatus;
  verifiedSteps: number;
  currentStep?: number;
}

export const PhaseColumn: React.FC<PhaseProps> = ({
  title,
  steps,
  result,
  status,
  verifiedSteps = 0,
  currentStep = -1,
}) => {
  const isActive = status === VerificationStatus.VERIFYING;
  const isCompleted = status === VerificationStatus.VERIFIED;
  const showTick = isCompleted;

  const getBorderColorClass = () => {
    return isCompleted ? "border-green-500" : "border-amber-500";
  };

  const borderClasses = `border-3 rounded-lg ${isActive ? "border-fill" : ""}`;
  const containerClasses = "flex flex-col h-full bg-black p-3 lg:p-5";
  const titleClasses = "text-white text-[1rem] lg:text-xl font-bold text-center mb-3 lg:mb-4";
  const resultClasses =
    "text-xs lg:text-sm text-white text-center mt-3 lg:mt-5 font-mono font-bold flex items-center justify-center";

  return (
    <div className={`${containerClasses} ${borderClasses} ${getBorderColorClass()}`}>
      <h3 className={titleClasses}>{title}</h3>

      <div className="flex-grow">
        {steps.map((step, index) => (
          <VerificationStep
            key={index}
            title={step.title}
            description={step.description}
            showArrow={index !== steps.length - 1}
            status={
              index < verifiedSteps
                ? VerificationStatus.VERIFIED
                : isActive && index === currentStep
                  ? VerificationStatus.VERIFYING
                  : VerificationStatus.PENDING
            }
          />
        ))}
      </div>

      <div className={resultClasses}>
        {result}
        <div
          className="flex items-center"
          dangerouslySetInnerHTML={{
            __html: TickIcon.replace(
              "<svg",
              `<svg width="26" height="26" class="ml-1" style="visibility: ${
                showTick ? "visible" : "hidden"
              }"`,
            ),
          }}
        />
      </div>
    </div>
  );
};

export default PhaseColumn;
