import classNames from "classnames";
import { Button } from "../../Button";

import type { StepType } from "../BrokenMemoExample";

export function MemoisePropStepExplanation({
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
        {hasChangedLocation ? "🚨" : ""} 2️⃣ – Memoise the products prop
      </h3>
      {hasChangedLocation ? (
        <MemoisePropStepErrorExplanation setStep={setStep} />
      ) : (
        <MemoisePropStepIntroductionExplanation />
      )}
    </div>
  );
}

function MemoisePropStepErrorExplanation({
  setStep,
}: {
  setStep: (step: StepType) => void;
}) {
  return (
    <>
      <p className="text-xs text-gray-600">
        <strong className="font-semibold text-sm">Problem: </strong>
        Every time the pick-up location changes, the{" "}
        <strong>ProductList</strong> STILL re-renders.
      </p>
      <p className="text-xs text-gray-600">
        This is because the <strong>ProductList</strong> component is not itself
        memoised.
      </p>
      <p className="text-xs text-gray-600">
        <strong className="font-semibold text-sm">Solution:</strong> Let's
        memoise the <strong>ProductList</strong> component.
      </p>
      <div className="flex justify-start gap-2">
        <Button size="sm" variant="outline" onClick={() => setStep("baseline")}>
          Back
        </Button>
        <Button size="sm" onClick={() => setStep("memoiseComponent")}>
          Next
        </Button>
      </div>
    </>
  );
}

function MemoisePropStepIntroductionExplanation() {
  return (
    <>
      <p className="text-xs text-gray-600">
        We have memoised the <strong>products array</strong> prop. Let's see if
        the <strong>ProductList</strong> component still re-renders.
      </p>
      <p className="text-xs text-gray-600">
        <strong>TODO:</strong>
      </p>
      <div className="flex items-center gap-2 animate-pulse duration-1000 ease-in-out bg-yellow-200/50 p-2 rounded-lg outline outline-yellow-300/50 ">
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
