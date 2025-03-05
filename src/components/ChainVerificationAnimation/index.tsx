import React, { useState, useEffect } from "react";
import PhaseColumn from "./Phase";
import type { VerificationStepData } from "./Phase";
import { Arrow } from "./Arrow";
import { VerificationStatus } from "./VerificationStatus";

const VerificationPhases: React.FC = () => {
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

  const x509Steps: VerificationStepData[] = [
    {
      title: "caltech.edu",
      description: "VeraId organisation",
      showArrow: true,
    },
    {
      title: "sheldon",
      description: "VeraId member",
    },
  ];

  const cmsSteps: VerificationStepData[] = [
    {
      title: "Bazinga!",
    },
  ];

  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [verifyingIndices, setVerifyingIndices] = useState<number[]>([-1, -1, -1]);
  const [completedPhases, setCompletedPhases] = useState<boolean[]>([false, false, false]);
  const [verifiedSteps, setVerifiedSteps] = useState<number[][]>([[], [], []]);
  const [verificationStarted, setVerificationStarted] = useState<boolean>(false);

  const allSteps = [dnssecSteps, x509Steps, cmsSteps];

  useEffect(() => {
    // This ensures all components are rendered with amber borders first
    const initialDelay = setTimeout(() => {
      setVerificationStarted(true);
      setVerifyingIndices([0, -1, -1]);

      const verifyStep = (phase: number, stepIndex: number) => {
        setTimeout(() => {
          setVerifiedSteps((prev) => {
            const newVerifiedSteps = [...prev];
            if (!newVerifiedSteps[phase].includes(stepIndex)) {
              newVerifiedSteps[phase] = [...newVerifiedSteps[phase], stepIndex];
            }
            return newVerifiedSteps;
          });

          const phaseSteps = allSteps[phase];

          if (stepIndex < phaseSteps.length - 1) {
            setVerifyingIndices((prev) => {
              const newIndices = [...prev];
              newIndices[phase] = stepIndex + 1;
              return newIndices;
            });

            setTimeout(() => {
              verifyStep(phase, stepIndex + 1);
            }, 500);
          } else {
            setVerifyingIndices((prev) => {
              const newIndices = [...prev];
              newIndices[phase] = -1;
              return newIndices;
            });

            setTimeout(() => {
              setCompletedPhases((prev) => {
                const newCompleted = [...prev];
                newCompleted[phase] = true;
                return newCompleted;
              });

              if (phase < allSteps.length - 1) {
                setCurrentPhase(phase + 1);

                setTimeout(() => {
                  setVerifyingIndices((prev) => {
                    const newIndices = [...prev];
                    newIndices[phase + 1] = 0;
                    return newIndices;
                  });

                  verifyStep(phase + 1, 0);
                }, 1000);
              }
            }, 500);
          }
        }, 2000); // Wait for the animation to complete before marking as verified
      };

      verifyStep(0, 0);
    }, 500);

    return () => {
      clearTimeout(initialDelay);
    };
  }, []);

  // Arrow component that changes direction based on screen size
  const ResponsiveArrow = () => (
    <div>
      <Arrow
        responsiveDirection={{
          mobile: "down",
          desktop: "right",
        }}
        className="text-neutral-300"
      />
    </div>
  );

  return (
    <div className="pt-2 pb-6 lg:pt-4 lg:pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-[33%]">
            <PhaseColumn
              title="DNSSEC Chain"
              steps={dnssecSteps}
              result="caltech.edu."
              status={
                completedPhases[0]
                  ? VerificationStatus.VERIFIED
                  : verificationStarted && currentPhase === 0
                    ? VerificationStatus.VERIFYING
                    : VerificationStatus.PENDING
              }
              verifiedSteps={verifiedSteps[0].length}
              currentStep={verifyingIndices[0]}
            />
          </div>

          <ResponsiveArrow />

          <div className="w-full md:w-[33%]">
            <PhaseColumn
              title="X.509 Certificate Chain"
              steps={x509Steps}
              result="sheldon@caltech.edu"
              status={
                completedPhases[1]
                  ? VerificationStatus.VERIFIED
                  : verificationStarted && currentPhase === 1
                    ? VerificationStatus.VERIFYING
                    : VerificationStatus.PENDING
              }
              verifiedSteps={verifiedSteps[1].length}
              currentStep={verifyingIndices[1]}
            />
          </div>

          <ResponsiveArrow />

          <div className="w-full md:w-[33%]">
            <PhaseColumn
              title="CMS SignedData"
              steps={cmsSteps}
              result="Verified"
              status={
                completedPhases[2]
                  ? VerificationStatus.VERIFIED
                  : verificationStarted && currentPhase === 2
                    ? VerificationStatus.VERIFYING
                    : VerificationStatus.PENDING
              }
              verifiedSteps={verifiedSteps[2].length}
              currentStep={verifyingIndices[2]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPhases;
