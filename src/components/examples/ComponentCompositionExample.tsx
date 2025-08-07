import { useState } from "react";
import { Button } from "../Button";

// Expensive component that we want to avoid re-rendering
function ExpensiveComponent({ data }: { data: string[] }) {
  console.log("💰 ExpensiveComponent rendered");

  // Simulate expensive computation
  const expensiveValue = data.reduce((sum, item, index) => {
    // Simulate some heavy computation
    for (let i = 0; i < 100000; i++) {
      sum += index;
    }
    return sum;
  }, 0);

  return (
    <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
      <h4 className="font-semibold text-purple-800 mb-2">
        Expensive Component
      </h4>
      <p className="text-sm text-gray-600">
        Expensive computation result: {expensiveValue}
      </p>
      <p className="text-sm text-gray-600">Data items: {data.length}</p>
    </div>
  );
}

// ❌ Bad approach: Everything re-renders when counter changes
function BadApproach() {
  const [counter, setCounter] = useState(0);
  const data = ["item1", "item2", "item3"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span>Counter: {counter}</span>
        <Button onClick={() => setCounter((c) => c + 1)} size="sm">
          Increment (Bad)
        </Button>
      </div>
      <ExpensiveComponent data={data} />
    </div>
  );
}

// ✅ Good approach: Use component composition to prevent unnecessary re-renders
function GoodApproach({ children }: { children: React.ReactNode }) {
  const [counter, setCounter] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span>Counter: {counter}</span>
        <Button onClick={() => setCounter((c) => c + 1)} size="sm">
          Increment (Good)
        </Button>
      </div>
      {children}
    </div>
  );
}

export function ComponentCompositionExample() {
  const data = ["item1", "item2", "item3"];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Component Composition vs Memoization
        </h3>
        <p className="text-sm text-gray-600">
          Component composition can be more effective than memoization for
          preventing unnecessary re-renders.
        </p>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700 mb-4">
          <strong>Open your browser console</strong> to see the difference. The
          "Bad" approach re-renders ExpensiveComponent on every counter
          increment. The "Good" approach using composition doesn't re-render
          ExpensiveComponent.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h4 className="font-medium text-red-600">
            ❌ Bad: Everything in same component
          </h4>
          <BadApproach />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-green-600">
            ✅ Good: Component composition
          </h4>
          <GoodApproach>
            <ExpensiveComponent data={data} />
          </GoodApproach>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Key insight:</strong> By moving the expensive component
          outside the stateful component and passing it as children, we avoid
          re-renders without any memoization at all. This is often simpler and
          more reliable than memoization.
        </p>
      </div>
    </div>
  );
}
