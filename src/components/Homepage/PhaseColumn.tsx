import React from "react";
import VerificationStep from "./VerificationStep";

export interface VerificationStepData {
  title: string;
  description: string;
  showArrow?: boolean;
}

interface PhaseColumnProps {
  title: string;
  steps: VerificationStepData[];
  result: string;
}

export const PhaseColumn: React.FC<PhaseColumnProps> = ({ title, steps, result }) => {
  return (
    <div className="flex flex-col h-full bg-black rounded-lg p-6">
      <h3 className="text-white text-xl font-bold text-center mb-6">{title}</h3>

      <div className="flex-grow">
        {steps.map((step, index) => (
          <VerificationStep
            key={index}
            title={step.title}
            description={step.description}
            showArrow={index !== steps.length - 1}
          />
        ))}
      </div>

      <div className="text-white text-center mt-4 font-mono">{result}</div>
    </div>
  );
};

export default PhaseColumn;
