import classNames from "classnames";
import { Button } from "../../Button";

import type { StepType } from "../BrokenMemoExample";

export function MemoisePropWithDependencyStepExplanation({
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
        {hasChangedLocation ? "🚨" : ""} 4️⃣ – Memoise Prop with Dependency
      </h3>
      {hasChangedLocation ? (
        <MemoisePropWithDependencyStepErrorExplanation setStep={setStep} />
      ) : (
        <MemoisePropWithDependencyStepIntroductionExplanation />
      )}
    </div>
  );
}

function MemoisePropWithDependencyStepErrorExplanation({
  setStep,
}: {
  setStep: (step: StepType) => void;
}) {
  return (
    <>
      <p className="text-xs text-gray-600">
        <strong className="font-semibold text-sm">Problem: </strong>
        Our memoisation is no longer working. The{" "}
        <strong>suggestedProducts</strong> array is not referentially stable.
      </p>
      <p className="text-xs text-gray-600">
        This means every time that <strong>Shopping App</strong> is re-rendered,{" "}
        <strong>suggestedProducts</strong> is re-created.
      </p>
      <p className="text-xs text-gray-600">
        This causes the <strong>useMemo</strong> hook to evaluate that{" "}
        <strong>products</strong> has changed and so our{" "}
        <strong>MemoisedProductList</strong> component is passed a new prop.
      </p>

      <div className="flex justify-start gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setStep("memoiseComponent")}
        >
          Back
        </Button>
        <Button size="sm" onClick={() => undefined}>
          Explanation
        </Button>
      </div>
    </>
  );
}

function MemoisePropWithDependencyStepIntroductionExplanation() {
  return (
    <>
      <p className="text-xs text-gray-600">
        What if the <strong>products array</strong> was dependant on another
        prop?
      </p>
      <p className="text-xs text-gray-600">
        You'll notice that the <strong>products array</strong> is now calculated
        based on another array of <strong>suggested products</strong>.
      </p>
      <p className="text-xs text-gray-600">
        What happens to our successful memoisation?
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
