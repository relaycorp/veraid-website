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
  const isCompleted = status === VerificationStatus.VERIFIED && currentStep === -1;
  const showTick = isCompleted;

  // Calculate animation duration based on number of steps. Ensure minimum duration of 1 second even if no steps
  const animationDuration = `${Math.max(1, steps.length)}s`;

  const getBorderColorClass = () => {
    return isCompleted ? "border-green-500" : "border-amber-500";
  };

  // Calculate progress for the border animation
  const getProgress = () => {
    // If all steps are verified, return 1 (100%)
    if (verifiedSteps >= steps.length) return 1;

    // Calculate progress including current step being verified
    if (isActive && currentStep >= 0) {
      // Include partial progress for the current step being verified (0.5)
      return (verifiedSteps + 0.5) / steps.length;
    } else {
      return verifiedSteps / steps.length;
    }
  };

  const borderClasses = isCompleted
    ? `border-3 rounded-lg ${getBorderColorClass()}`
    : "rounded-lg border-conic border-conic--progress";
  const containerClasses = "flex flex-col h-full bg-black p-3 lg:p-5";
  const titleClasses = "text-white text-[1rem] lg:text-xl font-bold text-center mb-3 lg:mb-4";
  const resultClasses =
    "text-xs lg:text-sm text-white text-center mt-3 lg:mt-5 font-mono font-bold flex items-center justify-center";

  const customStyle = !isCompleted
    ? ({
        "--animation-duration": animationDuration,
        "--progress": getProgress(),
      } as React.CSSProperties)
    : {};

  return (
    <div className={`${containerClasses} ${borderClasses}`} style={customStyle}>
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
            progress={index < verifiedSteps ? 1 : isActive && index === currentStep ? 0.5 : 0}
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
