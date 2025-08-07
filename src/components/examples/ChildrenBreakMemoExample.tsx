import { useState, memo, useMemo } from "react";
import { Button } from "../Button";

// This component is memoized but will still re-render due to children prop
const MemoizedWrapper = memo(function MemoizedWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  console.log("🔴 MemoizedWrapper rendered (broken by children)");

  return (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
      <h4 className="font-semibold text-red-800 mb-2">{title}</h4>
      {children}
    </div>
  );
});

// Same component but with memoized children
const MemoizedWrapperFixed = memo(function MemoizedWrapperFixed({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  console.log("✅ MemoizedWrapperFixed rendered (children memoized)");

  return (
    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
      <h4 className="font-semibold text-green-800 mb-2">{title}</h4>
      {children}
    </div>
  );
});

const ExpensiveChild = memo(function ExpensiveChild({
  count,
}: {
  count: number;
}) {
  console.log("💰 ExpensiveChild rendered");

  // Simulate expensive computation
  let result = 0;
  for (let i = 0; i < 100000; i++) {
    result += count;
  }

  return (
    <div className="p-2 bg-white rounded border">
      <p className="text-sm">Expensive computation result: {result}</p>
      <p className="text-sm text-gray-600">Count: {count}</p>
    </div>
  );
});

export function ChildrenBreakMemoExample() {
  const [counter, setCounter] = useState(0);
  const [childCount, setChildCount] = useState(5);

  // ❌ JSX creates new objects on every render, breaking memo
  const brokenChildren = (
    <div>
      <p className="text-sm mb-2">This JSX is recreated on every render</p>
      <ExpensiveChild count={childCount} />
    </div>
  );

  // ✅ Memoize the children to prevent unnecessary re-renders
  const memoizedChildren = useMemo(
    () => (
      <div>
        <p className="text-sm mb-2">This JSX is memoized</p>
        <ExpensiveChild count={childCount} />
      </div>
    ),
    [childCount]
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Children Break Memo</h3>
        <p className="text-sm text-gray-600">
          JSX creates new objects on every render, breaking React.memo even when
          props haven't changed.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm">
            Counter: {counter} | Child Count: {childCount}
          </span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCounter((c) => c + 1)} size="sm">
            Increment Counter
          </Button>
          <Button
            onClick={() => setChildCount((c) => c + 1)}
            size="sm"
            variant="secondary"
          >
            Update Child
          </Button>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-gray-700 mb-4">
          <strong>Open your browser console</strong> to see the difference. The
          broken example re-renders on every counter change. The fixed example
          only re-renders when child count changes.
        </p>
        <p className="text-sm text-gray-600">
          <strong>Key insight:</strong> Children is just another prop, and JSX
          creates new objects on every render. You must memoize children if you
          want memo to work effectively.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="font-medium text-red-600 mb-2">
            ❌ Broken: Children recreated
          </h4>
          <MemoizedWrapper title="Broken Wrapper">
            {brokenChildren}
          </MemoizedWrapper>
        </div>

        <div>
          <h4 className="font-medium text-green-600 mb-2">
            ✅ Fixed: Children memoized
          </h4>
          <MemoizedWrapperFixed title="Fixed Wrapper">
            {memoizedChildren}
          </MemoizedWrapperFixed>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Alternative: Component Composition</h4>
        <p className="text-sm text-gray-600">
          Instead of memoizing children, you can use component composition to
          move stateful logic higher up the component tree, preventing
          unnecessary re-renders altogether.
        </p>
      </div>
    </div>
  );
}
