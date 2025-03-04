import React from "react";
import PhaseColumn from "./PhaseColumn";
import type { VerificationStepData } from "./PhaseColumn";

const VerificationPhases: React.FC = () => {
  // Data for DNSSEC Chain
  const dnssecSteps: VerificationStepData[] = [
    {
      title: ". DNSSEC Root (IANA)",
      description: "NS record",
    },
    {
      title: "edu.",
      description: "NS record",
    },
    {
      title: "caltech.com.",
      description: "NS record",
    },
    {
      title: "_veraid.caltech.edu.",
      description: "TXT record; contains digest of public key of organisation.",
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

  return (
    <div className="bg-neutral-900 py-12 md:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <PhaseColumn
            title="DNSSEC Chain"
            steps={dnssecSteps}
            result="caltech.edu."
            showTick={true}
          />
          <PhaseColumn
            title="X.509 Certificate Chain"
            steps={x509Steps}
            result="sheldon@caltech.edu"
            showTick={true}
          />
          <PhaseColumn
            title="CMS SignedData"
            steps={cmsSteps}
            result='"Bazinga!"'
            showTick={true}
          />
        </div>
      </div>
    </div>
  );
};

export default VerificationPhases;
