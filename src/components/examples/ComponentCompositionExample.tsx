import { useState } from "react";
import { Button } from "../Button";
import { RenderTracker } from "../RenderTracker";
import { CodeBlock } from "../CodeBlock";

// Simulate the same products database for consistency
const PRODUCTS_DB = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round((Math.random() * 100 + 10) * 100) / 100,
  category: ["electronics", "clothing", "books", "home"][
    Math.floor(Math.random() * 4)
  ],
  inStock: Math.random() > 0.2,
}));

type Product = (typeof PRODUCTS_DB)[0];

// Expensive component that we want to avoid re-rendering
function ExpensiveProductAnalytics({ products }: { products: Product[] }) {
  // Simulate expensive computation - calculating analytics
  const analytics = products.reduce(
    (acc, product, index) => {
      // Simulate heavy computation
      for (let i = 0; i < 10000; i++) {
        acc.totalValue += product.price;
      }
      acc.categoryCount[product.category] =
        (acc.categoryCount[product.category] || 0) + 1;
      return acc;
    },
    {
      totalValue: 0,
      categoryCount: {} as Record<string, number>,
    }
  );

  return (
    <RenderTracker
      name="ExpensiveAnalytics"
      className="p-4 border border-purple-200 rounded-lg bg-purple-50"
    >
      <h4 className="font-semibold text-purple-800 mb-2">
        Expensive Product Analytics
      </h4>
      <div className="space-y-1 text-sm text-gray-600">
        <p>Total Value: ${analytics.totalValue.toFixed(2)}</p>
        <p>Products: {products.length}</p>
        <p>Categories: {Object.keys(analytics.categoryCount).length}</p>
      </div>
    </RenderTracker>
  );
}

// ❌ Bad approach: Everything re-renders when counter changes
function BadApproach() {
  const [counter, setCounter] = useState(0);
  // Creates new products array on every render
  const products = PRODUCTS_DB.filter((p) => p.inStock).slice(0, 100);

  return (
    <RenderTracker name="BadApproach" className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm">Counter: {counter}</span>
        <Button onClick={() => setCounter((c) => c + 1)} size="sm">
          Increment (Bad)
        </Button>
      </div>
      <ExpensiveProductAnalytics products={products} />
    </RenderTracker>
  );
}

// ✅ Good approach: Use component composition to prevent unnecessary re-renders
function GoodApproach({ children }: { children: React.ReactNode }) {
  const [counter, setCounter] = useState(0);

  return (
    <RenderTracker name="GoodApproach" className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm">Counter: {counter}</span>
        <Button onClick={() => setCounter((c) => c + 1)} size="sm">
          Increment (Good)
        </Button>
      </div>
      {children}
    </RenderTracker>
  );
}

const compositionCode = `// ❌ BAD: Expensive component re-renders with state changes
function BadDashboard() {
  const [counter, setCounter] = useState(0);
  const products = PRODUCTS_DB.filter(p => p.inStock); // New array every render
  
  return (
    <div>
      <button onClick={() => setCounter(c => c + 1)}>Count: {counter}</button>
      <ExpensiveAnalytics products={products} /> {/* Re-renders every time! */}
    </div>
  );
}

// ✅ GOOD: Component composition prevents unnecessary re-renders
function GoodDashboard({ children }) {
  const [counter, setCounter] = useState(0);
  
  return (
    <div>
      <button onClick={() => setCounter(c => c + 1)}>Count: {counter}</button>
      {children} {/* Children don't re-render when counter changes */}
    </div>
  );
}

// Usage:
function App() {
  const products = useMemo(() => PRODUCTS_DB.filter(p => p.inStock), []);
  
  return (
    <GoodDashboard>
      <ExpensiveAnalytics products={products} />
    </GoodDashboard>
  );
}`;

export function ComponentCompositionExample() {
  // Stable products reference - created once
  const products = PRODUCTS_DB.filter((p) => p.inStock).slice(0, 100);

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
          <strong>Watch the render counters</strong> below. The "Bad" approach
          re-renders ExpensiveAnalytics on every counter increment. The "Good"
          approach using composition doesn't re-render ExpensiveAnalytics.
        </p>
        <p className="text-sm text-gray-600">
          Notice how the expensive analytics calculation only runs when
          necessary.
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
            <ExpensiveProductAnalytics products={products} />
          </GoodApproach>
        </div>
      </div>

      <CodeBlock
        code={compositionCode}
        title="Component Composition Pattern"
        className="mt-6"
      />

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
