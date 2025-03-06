import React, { useReducer, useEffect } from "react";
import PhaseColumn from "./Phase";
import type { VerificationStepData } from "./Phase";
import { Arrow } from "./Arrow";
import { VerificationStatus } from "./VerificationStatus";
import PlayTriangleIcon from "../../assets/icons/play.svg?raw";
import RestartIcon from "../../assets/icons/restart.svg?raw";

interface AnimationState {
  currentPhase: number;
  verifyingIndices: number[];
  completedPhases: boolean[];
  verifiedSteps: number[][];
  status: "idle" | "running" | "completed";
  animationSpeed: number;
}

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
          animationSpeed: state.animationSpeed,
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

        if (step > 0 && !newVerifiedSteps[phase].includes(step - 1)) {
          newVerifiedSteps[phase] = [...newVerifiedSteps[phase], step - 1];
        }

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

        newVerifiedSteps[phase] = Array.from({ length: phaseSteps.length }, (_, i) => i);

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
      const currentPhase = state.currentPhase;
      const currentStepIndex = state.verifyingIndices[currentPhase];
      const phaseSteps = allSteps[currentPhase];

      if (currentStepIndex < phaseSteps.length - 1) {
        dispatch({
          type: "VERIFY_STEP",
          payload: { phase: currentPhase, step: currentStepIndex + 1 },
        });
      } else {
        dispatch({ type: "COMPLETE_PHASE", payload: currentPhase });

        // Short delay before moving to next phase
        setTimeout(() => {
          if (currentPhase < allSteps.length - 1) {
            dispatch({ type: "ADVANCE_TO_NEXT_PHASE" });
          } else {
            dispatch({ type: "COMPLETE_ANIMATION" });
          }
        }, state.animationSpeed / 2);
      }
    }, state.animationSpeed);

    return () => clearTimeout(timer);
  }, [state.status, state.currentPhase, state.verifyingIndices, state.animationSpeed]);

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
    <div
      className={`pb-6 lg:pb-8 ${state.status !== "idle" && state.status !== "running" ? "pb-6" : ""}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Animation content */}
          <div
            className={`flex flex-col md:flex-row items-center justify-between transition-all duration-300 ${
              state.status === "idle" ? "opacity-60" : ""
            }`}
          >
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
                result='"Bazinga!"'
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
          </div>

          {/* Dark overlay - visible only when idle */}
          <div
            className={`absolute inset-0 bg-black/70 rounded-md transition-opacity duration-300 ${
              state.status === "idle" ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />

          {/* Play button - only visible when idle */}
          <div
            className={`absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-opacity duration-300 ${
              state.status === "idle" ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex flex-col items-center">
              <button
                className="pointer-events-auto w-16 h-16 bg-green-400 hover:bg-green-300 text-black rounded-full shadow-lg transform transition-all hover:scale-105 flex items-center justify-center"
                onClick={() => {
                  dispatch({ type: "START_ANIMATION" });
                }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: PlayTriangleIcon.replace("<svg", `<svg class="h-8 w-8"`),
                  }}
                />
              </button>
              <span className="mt-2 text-white text-sm pointer-events-none">Play</span>
            </div>
          </div>

          {/* Restart button - only rendered when animation is completed */}
          {state.status !== "idle" && state.status !== "running" && (
            <div className="w-full flex justify-center mt-8 md:absolute md:mt-0 md:top-0 md:right-0 md:z-10 md:w-auto">
              <div className="flex flex-col items-center">
                <button
                  className="pointer-events-auto w-12 h-12 bg-neutral-700 hover:bg-neutral-600 text-white rounded-full shadow-lg transform transition-all hover:scale-105 flex items-center justify-center md:opacity-80 md:hover:opacity-100"
                  onClick={() => {
                    dispatch({ type: "RESET_ANIMATION" });
                    dispatch({ type: "START_ANIMATION" });
                  }}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: RestartIcon.replace("<svg", `<svg class="h-6 w-6 md:h-5 md:w-5"`),
                    }}
                  />
                </button>
                <span className="mt-2 md:mt-1 text-white text-sm md:text-xs pointer-events-none">
                  Replay
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPhases;
