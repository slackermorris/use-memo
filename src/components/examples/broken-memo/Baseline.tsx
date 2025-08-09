import classNames from "classnames";
import { Button } from "../../Button";

import type { StepType } from "../BrokenMemoExample";

function BaselineStepErrorExplanation({
  setStep,
}: {
  setStep: (step: StepType) => void;
}) {
  return (
    <>
      <p className="text-xs text-gray-600">
        <strong className="font-semibold text-sm">Problem: </strong>
        Every time the pick-up location changes, the ProductList re-renders.
      </p>
      <p className="text-xs text-gray-600">
        When the pick-up location changes, the <strong>products array</strong>{" "}
        is recreated, so <strong>ProductList</strong> sees a new products prop
        and re-renders.
      </p>
      <p className="text-xs text-gray-600">
        <strong className="font-semibold text-sm">Solution:</strong> Surely,
        memoising the{" "}
        <strong>products array</strong> would prevent those unnecessary
        re-renders. Let's memoise the products prop.
      </p>
      <div className="flex justify-start gap-2">
        <Button size="sm" onClick={() => setStep("memoiseProp")}>
          Next
        </Button>
      </div>
    </>
  );
}

function BaselineStepIntroductionExplanation() {
  return (
    <>
      <p className="text-xs text-gray-600">
        We are going to test the rendering behaviour of the components in our
        example Shopping Application.
      </p>
      <p className="text-xs text-gray-600">
        <strong>TODO:</strong>
      </p>
      <div className="flex items-center gap-2 animate-pulse duration-1000 ease-in-out bg-yellow-200/50 p-2 rounded-lg outline outline-yellow-300/50">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <input
            type="checkbox"
            name="memo"
            id="memo"
            checked={false}
            onChange={() => {}}
          />
          <label htmlFor="memo">Change the pick-up location.</label>
        </div>
      </div>
    </>
  );
}

export function BaselineStepExplanation({
  hasChangedLocation,
  setStep,
}: {
  hasChangedLocation: boolean;
  setStep: (step: StepType) => void;
}) {
  return (
    <div
      className={classNames("space-y-2 p-4 border rounded-lg", {
        "bg-red-100 shadow-lg shadow-red-300/20 ring-2 ring-red-300":
          hasChangedLocation,
        "bg-gray-100 shadow-lg shadow-gray-300/20 ring-2 ring-gray-300":
          !hasChangedLocation,
      })}
    >
      <h3 className="font-semibold">
        {hasChangedLocation ? "🚨" : ""} 1️⃣ – Baseline (no memo)
      </h3>
      {hasChangedLocation ? (
        <BaselineStepErrorExplanation setStep={setStep} />
      ) : (
        <BaselineStepIntroductionExplanation />
      )}
    </div>
  );
}
