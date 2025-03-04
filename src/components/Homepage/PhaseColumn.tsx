import React from "react";
import VerificationStep from "./VerificationStep";

// Import the tick SVG
import tickIcon from "../../assets/icons/tick.svg";

export interface VerificationStepData {
  title: string;
  description?: string;
  showArrow?: boolean;
}

interface PhaseColumnProps {
  title: string;
  steps: VerificationStepData[];
  result: string;
  showTick?: boolean;
}

export const PhaseColumn: React.FC<PhaseColumnProps> = ({
  title,
  steps,
  result,
  showTick = false,
}) => {
  return (
    <div className="flex flex-col h-full bg-black rounded-lg p-4 lg:p-6">
      <h3 className="text-white text-md lg:text-xl font-bold text-center mb-4">{title}</h3>

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

      <div className="text-white text-center mt-4 font-mono flex items-center justify-center">
        {result}
        {showTick && (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2"
          >
            <path
              d="M17.1299 3.47674L18.3715 5.62758L20.5427 6.88097C20.6456 6.94086 20.7029 7.04882 20.7029 7.16017L20.7046 9.6686L21.9572 11.8372C22.017 11.9418 22.012 12.0649 21.9555 12.1619L20.7054 14.327V16.8363C20.7054 16.9671 20.6278 17.0801 20.5157 17.1307L18.3724 18.3689L17.1198 20.5401C17.06 20.6438 16.952 20.7012 16.8407 20.702L14.3314 20.7037L12.1628 21.9562C12.0582 22.0161 11.935 22.0111 11.8381 21.9546L9.67208 20.7045H7.16278C7.03204 20.7045 6.91902 20.6269 6.8684 20.5148L5.63019 18.3715L3.45903 17.1189C3.35528 17.0591 3.29793 16.9511 3.29709 16.8397L3.2954 14.3304L2.04284 12.1619C1.98296 12.0573 1.98802 11.9341 2.04453 11.8371L3.29456 9.67204V7.16274C3.29456 7.03453 3.36878 6.92403 3.47759 6.87089L5.62927 5.62846L6.88183 3.45903C6.94171 3.35528 7.04968 3.29793 7.16102 3.29708L9.67032 3.2954L11.8389 2.04284C11.9435 1.98296 12.0666 1.98802 12.1636 2.04453L14.3287 3.29456H16.838C16.9662 3.29456 17.0767 3.36878 17.1299 3.47759L17.1299 3.47674Z"
              fill="#01FD93"
            />
            <path
              d="M17.2584 7.15411C17.0948 6.96724 16.8029 6.94388 16.616 7.11907C15.8919 7.74976 15.2261 8.41549 14.5604 9.10458C13.9064 9.79367 13.264 10.4944 12.645 11.2186C11.734 12.3047 10.858 13.4376 10.0405 14.6056L7.07389 11.4171C6.93374 11.2653 6.70015 11.2186 6.51328 11.3354C6.29137 11.4638 6.22129 11.7441 6.34976 11.966C6.34976 11.966 9.17619 16.8364 9.29298 17.0466C9.40978 17.2451 9.66672 17.5605 10.1923 17.5605C10.7062 17.5605 10.9865 17.2568 11.15 16.9415C11.3252 16.6145 12.8902 13.718 13.9064 12.1879C14.4086 11.4171 14.9575 10.6696 15.5064 9.93382C16.0671 9.19801 16.651 8.47389 17.2467 7.79648L17.2584 7.7848C17.4102 7.58625 17.4102 7.3293 17.2584 7.15411Z"
              fill="#191B1A"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default PhaseColumn;
