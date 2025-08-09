import { useState, memo, useMemo } from "react";
import { Button } from "../Button";
import { RenderTracker } from "../RenderTracker";
import { CodeBlock } from "../CodeBlock";

// This component is memoized but will still re-render due to children prop
const MemoizedWrapper = memo(function MemoizedWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <RenderTracker
      name="MemoizedWrapper"
      className="p-4 border border-red-200 rounded-lg bg-red-50"
    >
      <h4 className="font-semibold text-red-800 mb-2">{title}</h4>
      {children}
    </RenderTracker>
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
  return (
    <RenderTracker
      name="MemoizedWrapperFixed"
      className="p-4 border border-green-200 rounded-lg bg-green-50"
    >
      <h4 className="font-semibold text-green-800 mb-2">{title}</h4>
      {children}
    </RenderTracker>
  );
});

const ExpensiveShoppingCartSummary = memo(
  function ExpensiveShoppingCartSummary({ itemCount }: { itemCount: number }) {
    // Simulate expensive computation - calculating cart totals, taxes, shipping
    let total = 0;
    let tax = 0;
    let shipping = 0;

    for (let i = 0; i < 50000; i++) {
      total += itemCount * 29.99;
      tax += total * 0.08;
      shipping += itemCount > 5 ? 0 : 9.99;
    }

    return (
      <RenderTracker
        name="ExpensiveCartSummary"
        className="p-2 bg-white rounded border"
      >
        <div className="text-sm space-y-1">
          <p>Cart Items: {itemCount}</p>
          <p>Subtotal: ${(total / 50000).toFixed(2)}</p>
          <p>Tax: ${(tax / 50000).toFixed(2)}</p>
          <p>Shipping: ${(shipping / 50000).toFixed(2)}</p>
          <p className="font-semibold">
            Total: ${((total + tax + shipping) / 50000).toFixed(2)}
          </p>
        </div>
      </RenderTracker>
    );
  }
);

const childrenBreakCode = `// ❌ BROKEN: JSX children recreated on every render
function ShoppingCartPage() {
  const [counter, setCounter] = useState(0);
  const [cartItems, setCartItems] = useState(5);
  
  return (
    <MemoizedWrapper title="Cart Summary">
      {/* This JSX is recreated every render, breaking memo! */}
      <div>
        <p>Updated at: {new Date().toLocaleTimeString()}</p>
        <ExpensiveCartSummary itemCount={cartItems} />
      </div>
    </MemoizedWrapper>
  );
}

// ✅ FIXED: Memoize the children
function ShoppingCartPage() {
  const [counter, setCounter] = useState(0);
  const [cartItems, setCartItems] = useState(5);
  
  // ✅ Memoized children - stable reference
  const cartSummary = useMemo(() => (
    <div>
      <p>Updated at: {new Date().toLocaleTimeString()}</p>
      <ExpensiveCartSummary itemCount={cartItems} />
    </div>
  ), [cartItems]);
  
  return (
    <MemoizedWrapper title="Cart Summary">
      {cartSummary}
    </MemoizedWrapper>
  );
}`;

export function ChildrenBreakMemoExample() {
  const [counter, setCounter] = useState(0);
  const [cartItems, setCartItems] = useState(5);

  // ❌ JSX creates new objects on every render, breaking memo
  const brokenChildren = (
    <div>
      <p className="text-sm mb-2">This JSX is recreated on every render</p>
      <ExpensiveShoppingCartSummary itemCount={cartItems} />
    </div>
  );

  // ✅ Memoize the children to prevent unnecessary re-renders
  const memoizedChildren = useMemo(
    () => (
      <div>
        <p className="text-sm mb-2">This JSX is memoized</p>
        <ExpensiveShoppingCartSummary itemCount={cartItems} />
      </div>
    ),
    [cartItems]
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
            Counter: {counter} | Cart Items: {cartItems}
          </span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCounter((c) => c + 1)} size="sm">
            Increment Counter
          </Button>
          <Button
            onClick={() => setCartItems((c) => c + 1)}
            size="sm"
            variant="secondary"
          >
            Add Cart Item
          </Button>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-gray-700 mb-4">
          <strong>Watch the render counters</strong> below. The broken example
          re-renders the expensive cart summary on every counter change. The
          fixed example only re-renders when cart items change.
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
          <MemoizedWrapper title="Broken Cart Wrapper">
            {brokenChildren}
          </MemoizedWrapper>
        </div>

        <div>
          <h4 className="font-medium text-green-600 mb-2">
            ✅ Fixed: Children memoized
          </h4>
          <MemoizedWrapperFixed title="Fixed Cart Wrapper">
            {memoizedChildren}
          </MemoizedWrapperFixed>
        </div>
      </div>

      <CodeBlock
        code={childrenBreakCode}
        title="Children Break Memo Pattern"
        className="mt-6"
      />

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
