import React from "react";
import VerificationStep from "./VerificationStep";
import TickIcon from "../../assets/icons/tick.svg?raw";
import { VerificationStatus } from "./VerificationStatus";

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

  return (
    <div
      className={`flex flex-col h-full bg-black rounded-lg p-4 lg:p-6 ${
        showTick ? "border-2 lg:border-3 border-green-500" : ""
      }`}
    >
      <h3 className="text-white text-[1rem] lg:text-xl font-bold text-center mb-4">{title}</h3>

      <div className="flex-grow">
        {steps.map((step, index) => (
          <VerificationStep
            key={index}
            title={step.title}
            description={step.description}
            showArrow={index !== steps.length - 1}
            isVerifying={isActive && index === currentStep}
            isVerified={index < verifiedSteps}
          />
        ))}
      </div>

      <div className="text-sm lg:text-base text-white text-center mt-4 font-mono flex items-center justify-center">
        {result}
        <div
          className="flex items-center"
          dangerouslySetInnerHTML={{
            __html: TickIcon.replace(
              "<svg",
              `<svg width="28" height="28" class="ml-2" style="visibility: ${
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
