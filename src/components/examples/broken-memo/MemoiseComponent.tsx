import classNames from "classnames";
import { Button } from "../../Button";

import type { StepType } from "../BrokenMemoExample";

export function MemoiseComponentStepExplanation({
  hasChangedLocation,
  setStep,
}: {
  hasChangedLocation: boolean;
  setStep: (step: StepType) => void;
}) {
  return (
    <>
      <div
        className={classNames("space-y-2 p-4 border rounded-lg", {
          "bg-green-100 shadow-lg shadow-green-300/20 ring-2 ring-green-300":
            hasChangedLocation,
          "bg-gray-100 shadow-lg shadow-gray-300/20 ring-2 ring-gray-300":
            !hasChangedLocation,
        })}
      >
        <h3 className="font-semibold">
          {hasChangedLocation ? "✅" : ""} 3️⃣ – Memoise the component
        </h3>
        {hasChangedLocation ? (
          <MemoiseComponentStepErrorExplanation setStep={setStep} />
        ) : (
          <MemoiseComponentStepIntroductionExplanation />
        )}
      </div>
    </>
  );
}

function MemoiseComponentStepErrorExplanation({
  setStep,
}: {
  setStep: (step: StepType) => void;
}) {
  return (
    <>
      <p className="text-xs text-gray-600">
        Well, would you look at that! You'll notice that the{" "}
        <strong>ProductList</strong> no longer re-renders when the pick-up
        location changes.
      </p>
      <p className="text-xs text-gray-600">
        Finally our memoisation is working.
      </p>
      <p className="text-xs text-gray-600">
        However, what if the <strong>products array</strong> was dependant on
        another prop?
      </p>
      <div className="flex justify-start gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setStep("memoiseProp")}
        >
          Back
        </Button>
        <Button size="sm" onClick={() => setStep("memoisePropWithDependency")}>
          Next
        </Button>
      </div>
    </>
  );
}

function MemoiseComponentStepIntroductionExplanation() {
  return (
    <>
      <p className="text-xs text-gray-600">
        We have memoised the <strong>ProductList</strong> component. Let's see
        if the <strong>ProductList</strong> component still re-renders
        unnecessarily.
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
