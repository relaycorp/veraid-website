import React from "react";
import PhaseColumn from "./PhaseColumn";
import type { VerificationStepData } from "./PhaseColumn";

const VerificationPhases: React.FC = () => {
  // Data for DNSSEC Chain
  const dnssecSteps: VerificationStepData[] = [
    {
      title: ".",
      description: "DNSSEC Root (IANA)",
    },
    {
      title: "edu.",
    },
    {
      title: "caltech.edu.",
    },
    {
      title: "_veraid.caltech.edu.",
      description: "TXT record containing digest of public key of organisation.",
    },
  ];

  // Data for X.509 Certificate Chain
  const x509Steps: VerificationStepData[] = [
    {
      title: "VeraId organisation certificate",
      description: "CN=caltech.edu",
      showArrow: true,
    },
    {
      title: "VeraId member certificate",
      description: "CN=sheldon",
    },
  ];

  // Data for CMS SignedData
  const cmsSteps: VerificationStepData[] = [
    {
      title: "Bazinga!",
      description: "",
    },
  ];

  // Arrow component that changes direction based on screen size
  const DirectionalArrow = () => (
    <div className="flex items-center justify-center py-4 md:py-0">
      {/* Vertical arrow for small screens */}
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
        className="text-neutral-300 md:hidden"
      >
        <path d="M12 5v14" />
        <path d="m5 12 7 7 7-7" />
      </svg>

      {/* Horizontal arrow for medium screens and up */}
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
        className="text-neutral-300 hidden md:block"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </div>
  );

  return (
    <div className="py-2 md:py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-[33%]">
            <PhaseColumn
              title="DNSSEC Chain"
              steps={dnssecSteps}
              result="caltech.edu."
              showTick={true}
            />
          </div>

          <div>
            <DirectionalArrow />
          </div>

          <div className="w-full md:w-[33%]">
            <PhaseColumn
              title="X.509 Certificate Chain"
              steps={x509Steps}
              result="sheldon@caltech.edu"
              showTick={true}
            />
          </div>

          <div>
            <DirectionalArrow />
          </div>

          <div className="w-full md:w-[33%]">
            <PhaseColumn
              title="CMS SignedData"
              steps={cmsSteps}
              result='"Bazinga!"'
              showTick={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPhases;
