import React, { useState, useEffect } from "react";
import PhaseColumn from "./PhaseColumn";
import type { VerificationStepData } from "./PhaseColumn";
import { Arrow } from "./Arrow";

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
      title: "caltech.edu",
      description: "VeraId organisation",
      showArrow: true,
    },
    {
      title: "sheldon",
      description: "VeraId member",
    },
  ];

  // Data for CMS SignedData
  const cmsSteps: VerificationStepData[] = [
    {
      title: "Bazinga!",
      description: "",
    },
  ];

  // State to track verification progress across all phases
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [verifyingIndices, setVerifyingIndices] = useState<number[]>([-1, -1, -1]);
  const [completedPhases, setCompletedPhases] = useState<boolean[]>([false, false, false]);
  const [verifiedSteps, setVerifiedSteps] = useState<number[][]>([[], [], []]);
  const [verificationStarted, setVerificationStarted] = useState<boolean>(false);

  // All steps for each phase
  const allSteps = [dnssecSteps, x509Steps, cmsSteps];

  // Start the verification animation when the component mounts
  useEffect(() => {
    // Add a small delay before starting the verification process
    // This ensures all components are rendered with amber borders first
    const initialDelay = setTimeout(() => {
      setVerificationStarted(true);
      // Start with the first phase, first step
      setVerifyingIndices([0, -1, -1]);

      // Function to handle verification of a single step
      const verifyStep = (phase: number, stepIndex: number) => {
        // Mark the current step as verified after the animation completes
        setTimeout(() => {
          setVerifiedSteps((prev) => {
            const newVerifiedSteps = [...prev];
            if (!newVerifiedSteps[phase].includes(stepIndex)) {
              newVerifiedSteps[phase] = [...newVerifiedSteps[phase], stepIndex];
            }
            return newVerifiedSteps;
          });

          const phaseSteps = allSteps[phase];

          // If there are more steps in this phase, move to the next step
          if (stepIndex < phaseSteps.length - 1) {
            setVerifyingIndices((prev) => {
              const newIndices = [...prev];
              newIndices[phase] = stepIndex + 1;
              return newIndices;
            });

            // Schedule verification of the next step
            setTimeout(() => {
              verifyStep(phase, stepIndex + 1);
            }, 500); // Small delay before starting the next step
          }
          // If this was the last step in the phase
          else {
            // Set verifying index to -1 to stop the animation
            setVerifyingIndices((prev) => {
              const newIndices = [...prev];
              newIndices[phase] = -1;
              return newIndices;
            });

            // Mark this phase as completed after a small delay
            setTimeout(() => {
              setCompletedPhases((prev) => {
                const newCompleted = [...prev];
                newCompleted[phase] = true;
                return newCompleted;
              });

              // If there are more phases, start the next one
              if (phase < allSteps.length - 1) {
                setCurrentPhase(phase + 1);

                // Schedule verification of the first step in the next phase
                setTimeout(() => {
                  setVerifyingIndices((prev) => {
                    const newIndices = [...prev];
                    newIndices[phase + 1] = 0; // Start next phase
                    return newIndices;
                  });

                  verifyStep(phase + 1, 0);
                }, 1000); // Small delay before starting the next phase
              }
            }, 500); // Small delay after the last step is verified
          }
        }, 2000); // Wait for the animation to complete before marking as verified
      };

      // Start the verification process
      verifyStep(0, 0);
    }, 500); // Initial delay before starting verification

    // Cleanup function
    return () => {
      clearTimeout(initialDelay);
    };
  }, []); // Empty dependency array means this runs once on mount

  // Arrow component that changes direction based on screen size
  const DirectionalArrow = () => (
    <Arrow
      responsiveDirection={{
        mobile: "down",
        desktop: "right",
      }}
      className="text-neutral-300"
    />
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
              showTick={true}
              isActive={verificationStarted && currentPhase === 0}
              verifyingIndex={verifyingIndices[0]}
              verifiedIndices={verifiedSteps[0]}
              isCompleted={completedPhases[0]}
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
              isActive={verificationStarted && currentPhase === 1}
              verifyingIndex={verifyingIndices[1]}
              verifiedIndices={verifiedSteps[1]}
              isCompleted={completedPhases[1]}
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
              isActive={verificationStarted && currentPhase === 2}
              verifyingIndex={verifyingIndices[2]}
              verifiedIndices={verifiedSteps[2]}
              isCompleted={completedPhases[2]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPhases;
