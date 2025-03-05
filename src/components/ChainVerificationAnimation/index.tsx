import React, { useReducer, useEffect } from "react";
import PhaseColumn from "./Phase";
import type { VerificationStepData } from "./Phase";
import { Arrow } from "./Arrow";
import { VerificationStatus } from "./VerificationStatus";

// Animation state types
interface AnimationState {
  currentPhase: number;
  verifyingIndices: number[];
  completedPhases: boolean[];
  verifiedSteps: number[][];
  status: "idle" | "running" | "completed";
  animationSpeed: number; // milliseconds per step
}

// Action types
type AnimationAction =
  | { type: "START_ANIMATION" }
  | { type: "RESET_ANIMATION" }
  | { type: "SET_ANIMATION_SPEED"; payload: number }
  | { type: "VERIFY_STEP"; payload: { phase: number; step: number } }
  | { type: "COMPLETE_PHASE"; payload: number }
  | { type: "ADVANCE_TO_NEXT_PHASE" }
  | { type: "COMPLETE_ANIMATION" };

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

  const allSteps = [dnssecSteps, x509Steps, cmsSteps];

  const initialState: AnimationState = {
    currentPhase: 0,
    verifyingIndices: [-1, -1, -1],
    completedPhases: [false, false, false],
    verifiedSteps: [[], [], []],
    status: "idle",
    animationSpeed: 1000,
  };

  function animationReducer(state: AnimationState, action: AnimationAction): AnimationState {
    switch (action.type) {
      case "START_ANIMATION":
        return {
          ...state,
          status: "running",
          verifyingIndices: [0, -1, -1],
        };

      case "RESET_ANIMATION":
        return {
          ...initialState,
          animationSpeed: state.animationSpeed, // Preserve user's speed setting
        };

      case "SET_ANIMATION_SPEED":
        return {
          ...state,
          animationSpeed: action.payload,
        };

      case "VERIFY_STEP": {
        const { phase, step } = action.payload;
        const newVerifiedSteps = [...state.verifiedSteps];
        const newVerifyingIndices = [...state.verifyingIndices];

        // Mark previous step as verified
        if (step > 0 && !newVerifiedSteps[phase].includes(step - 1)) {
          newVerifiedSteps[phase] = [...newVerifiedSteps[phase], step - 1];
        }

        // Set current verifying step
        newVerifyingIndices[phase] = step;

        return {
          ...state,
          verifiedSteps: newVerifiedSteps,
          verifyingIndices: newVerifyingIndices,
        };
      }

      case "COMPLETE_PHASE": {
        const phase = action.payload;
        const newCompletedPhases = [...state.completedPhases];
        const newVerifiedSteps = [...state.verifiedSteps];
        const phaseSteps = allSteps[phase];

        // Mark all steps in phase as verified
        newVerifiedSteps[phase] = Array.from({ length: phaseSteps.length }, (_, i) => i);

        // Mark phase as completed
        newCompletedPhases[phase] = true;

        return {
          ...state,
          completedPhases: newCompletedPhases,
          verifiedSteps: newVerifiedSteps,
          verifyingIndices: state.verifyingIndices.map((idx, i) => (i === phase ? -1 : idx)),
        };
      }

      case "ADVANCE_TO_NEXT_PHASE":
        return {
          ...state,
          currentPhase: state.currentPhase + 1,
          verifyingIndices: state.verifyingIndices.map((idx, i) =>
            i === state.currentPhase + 1 ? 0 : idx,
          ),
        };

      case "COMPLETE_ANIMATION":
        return {
          ...state,
          status: "completed",
        };

      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(animationReducer, initialState);

  // Animation loop controlled by a single effect
  useEffect(() => {
    if (state.status !== "running") return;

    const timer = setTimeout(() => {
      // Determine next action based on current state
      const currentPhase = state.currentPhase;
      const currentStepIndex = state.verifyingIndices[currentPhase];
      const phaseSteps = allSteps[currentPhase];

      if (currentStepIndex < phaseSteps.length - 1) {
        // Move to next step in current phase
        dispatch({
          type: "VERIFY_STEP",
          payload: { phase: currentPhase, step: currentStepIndex + 1 },
        });
      } else {
        // Complete current phase
        dispatch({ type: "COMPLETE_PHASE", payload: currentPhase });

        // Short delay before moving to next phase
        setTimeout(() => {
          if (currentPhase < allSteps.length - 1) {
            // Move to next phase
            dispatch({ type: "ADVANCE_TO_NEXT_PHASE" });
          } else {
            // Animation complete
            dispatch({ type: "COMPLETE_ANIMATION" });
          }
        }, state.animationSpeed / 2);
      }
    }, state.animationSpeed);

    return () => clearTimeout(timer);
  }, [state.status, state.currentPhase, state.verifyingIndices, state.animationSpeed]);

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
    <div className="pb-6 lg:pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between relative">
          <div className="w-full md:w-[33%]">
            <PhaseColumn
              title="DNSSEC Chain"
              steps={dnssecSteps}
              result="caltech.edu."
              status={
                state.completedPhases[0]
                  ? VerificationStatus.VERIFIED
                  : state.status === "running" && state.currentPhase === 0
                    ? VerificationStatus.VERIFYING
                    : VerificationStatus.PENDING
              }
              verifiedSteps={state.verifiedSteps[0].length}
              currentStep={state.verifyingIndices[0]}
            />
          </div>

          <ResponsiveArrow />

          <div className="w-full md:w-[33%]">
            <PhaseColumn
              title="X.509 Certificate Chain"
              steps={x509Steps}
              result="sheldon@caltech.edu"
              status={
                state.completedPhases[1]
                  ? VerificationStatus.VERIFIED
                  : state.status === "running" && state.currentPhase === 1
                    ? VerificationStatus.VERIFYING
                    : VerificationStatus.PENDING
              }
              verifiedSteps={state.verifiedSteps[1].length}
              currentStep={state.verifyingIndices[1]}
            />
          </div>

          <ResponsiveArrow />

          <div className="w-full md:w-[33%]">
            <PhaseColumn
              title="CMS SignedData"
              steps={cmsSteps}
              result="Verified"
              status={
                state.completedPhases[2]
                  ? VerificationStatus.VERIFIED
                  : state.status === "running" && state.currentPhase === 2
                    ? VerificationStatus.VERIFYING
                    : VerificationStatus.PENDING
              }
              verifiedSteps={state.verifiedSteps[2].length}
              currentStep={state.verifyingIndices[2]}
            />
          </div>

          {/* Overlay button positioned in the center */}
          <div
            className={`absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-opacity duration-300 ${
              state.status === "running" ? "opacity-0" : "opacity-100"
            }`}
          >
            <button
              className="pointer-events-auto px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-full shadow-lg transform transition-all hover:scale-105"
              onClick={() => {
                if (state.status === "idle") {
                  dispatch({ type: "START_ANIMATION" });
                } else {
                  dispatch({ type: "RESET_ANIMATION" });
                  dispatch({ type: "START_ANIMATION" });
                }
              }}
            >
              <span className="flex items-center gap-3">
                {state.status === "idle" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 384 512"
                    >
                      <path
                        fill="currentColor"
                        d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                      />
                    </svg>
                    Play
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"
                      />
                    </svg>
                    Restart
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPhases;
