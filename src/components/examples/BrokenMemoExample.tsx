import { useState, memo, useMemo } from "react";
import { Button } from "../Button";
import { RenderTracker } from "../RenderTracker";
import { CodeBlock } from "../CodeBlock";

type StepType = "baseline" | "memoiseProp" | "memoiseComponent";

// // Theme context used to demonstrate how Providers can break memoization if value is unstable
// const ThemeContext = createContext<{ mode: "light" | "dark" }>({
//   mode: "light",
// });
// const useTheme = () => useContext(ThemeContext);

const CODE_BASELINE = `
function ShoppingApp() {
  const [location, setLocation] = useState<
    "island_bay" | "wellington_central" | "wellington_airport" | "wellington_west"
  >("island_bay");

  const products = PRODUCTS;

  return (
    <>
      <h3>🛒 Click & Collect Shopping Application</h3>
      <ShoppingLocationSelector
        location={location}
        setLocation={setLocation}
      />
      <ProductList
        products={products}
      />
    </>
  );
};
  
const PRODUCTS = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    category: "electronics",
    inStock: true,
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    category: "clothing",
    inStock: false,
  },
  {
    id: 3,
    name: "Product 3",
    price: 300,
    category: "books",
    inStock: true,
  },
];
`;

const CODE_MEMOISE_PROP = `
function ShoppingApp() {
  const [location, setLocation] = useState<
    "island_bay" | "wellington_central" | "wellington_airport" | "wellington_west"
  >("island_bay");

  const products = useMemo(() => PRODUCTS, []);

  return (
    <>
      <h3>🛒 Click & Collect Shopping Application</h3>
      <ShoppingLocationSelector
        location={location}
        setLocation={setLocation}
      />
      <ProductList
        products={products}
      />
    </>
  );
};
`;

const CODE_MEMOISE_COMPONENT = `
const MemoisedProductList = React.memo(ProductList);

function ShoppingApp() {
  const [location, setLocation] = useState<
    "island_bay" | "wellington_central" | "wellington_airport" | "wellington_west"
  >("island_bay");

  const products = useMemo(() => PRODUCTS, []);

  return (
    <>
      <h3>🛒 Click & Collect Shopping Application</h3>
      <ShoppingLocationSelector
        location={location}
        setLocation={setLocation}
      />
      <MemoisedProductList
        products={products}
      />
    </>
  );
};
`;

const PRODUCTS = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    category: "electronics",
    inStock: true,
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    category: "clothing",
    inStock: false,
  },
  {
    id: 3,
    name: "Product 3",
    price: 300,
    category: "books",
    inStock: true,
  },
];

export function BrokenMemoExample() {
  const [step, setStep] = useState<StepType>("baseline");

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "baseline", label: "Baseline" },
              { id: "memoiseProp", label: "Memoise the products prop" },
              { id: "memoiseComponent", label: "Memoise the component" },
            ].map((s) => (
              <Button
                key={s.id}
                size="sm"
                variant={
                  step === (s.id as typeof step) ? "primary" : "secondary"
                }
                onClick={() => setStep(s.id as typeof step)}
              >
                {s.label}
              </Button>
            ))}
          </div>
          <CodeRenderer step={step} />
        </div>

        <ShoppingAppRenderer step={step} setStep={setStep} />
      </div>
    </div>
  );
}

function CodeRenderer({ step }: { step: StepType }) {
  switch (step) {
    case "baseline":
      return (
        <CodeBlock code={CODE_BASELINE} title="Step 1 – Baseline (no memo)" />
      );
    case "memoiseProp":
      return (
        <CodeBlock
          code={CODE_MEMOISE_PROP}
          title="Step 2 – Memoise the products prop"
        />
      );
    case "memoiseComponent":
      return (
        <CodeBlock
          code={CODE_MEMOISE_COMPONENT}
          title="Step 3 – Memoise the component"
        />
      );
  }
}

function ShoppingAppRenderer({
  step,
  setStep,
}: {
  step: StepType;
  setStep: (step: StepType) => void;
}) {
  switch (step) {
    case "baseline":
      return (
        <div className="space-y-4 rounded-lg p-1 ring ring-gray-600/20 ring-inset">
          <StepExplanation step={step} setStep={setStep} />
          <ShoppingAppNoMemo />
        </div>
      );
    case "memoiseProp":
      return (
        <div className="space-y-4 rounded-lg p-1 ring ring-gray-600/20 ring-inset">
          <StepExplanation step={step} setStep={setStep} />
          <ShoppingAppMemoProp />
        </div>
      );
    case "memoiseComponent":
      return (
        <div className="space-y-4 rounded-lg p-1 ring ring-gray-600/20 ring-inset">
          <StepExplanation step={step} setStep={setStep} />
          <ShoppingAppMemoComponent />
        </div>
      );
  }
}

function ShoppingAppNoMemo() {
  const [location, setLocation] = useState<
    | "island_bay"
    | "wellington_central"
    | "wellington_airport"
    | "wellington_west"
  >("island_bay");

  const products = PRODUCTS;
  return (
    <RenderTracker name={`ShoppingApp`}>
      <div className="space-y-2 w-full bg-gray-100/80 ">
        <div className="flex items-center justify-between w-full p-4 bg-gray-200">
          <h3 className="text-lg font-semibold">
            🛒 Click & Collect Shopping Application
          </h3>
        </div>

        <div className="space-y-2 p-4">
          <ShoppingLocationSelector
            location={location}
            setLocation={setLocation}
          />

          <ProductList products={products} />
        </div>
      </div>
    </RenderTracker>
  );
}

function ShoppingAppMemoProp() {
  const [location, setLocation] = useState<
    | "island_bay"
    | "wellington_central"
    | "wellington_airport"
    | "wellington_west"
  >("island_bay");

  const products = useMemo(() => PRODUCTS, []);
  return (
    <RenderTracker name={`ShoppingApp`}>
      <div className="space-y-2 w-full bg-gray-100/80 ">
        <div className="flex items-center justify-between w-full p-4 bg-gray-200">
          <h3 className="text-lg font-semibold">
            🛒 Click & Collect Shopping Application
          </h3>
        </div>

        <div className="space-y-2 p-4">
          <ShoppingLocationSelector
            location={location}
            setLocation={setLocation}
          />

          <ProductList products={products} />
        </div>
      </div>
    </RenderTracker>
  );
}

const MemoisedProductList = memo(ProductList);

function ShoppingAppMemoComponent() {
  const [location, setLocation] = useState<
    | "island_bay"
    | "wellington_central"
    | "wellington_airport"
    | "wellington_west"
  >("island_bay");

  const products = useMemo(() => PRODUCTS, []);
  return (
    <RenderTracker name={`ShoppingApp`}>
      <div className="space-y-2 w-full bg-gray-100/80 ">
        <div className="flex items-center justify-between w-full p-4 bg-gray-200">
          <h3 className="text-lg font-semibold">
            🛒 Click & Collect Shopping Application
          </h3>
        </div>

        <div className="space-y-2 p-4">
          <ShoppingLocationSelector
            location={location}
            setLocation={setLocation}
          />

          <MemoisedProductList products={products} />
        </div>
      </div>
    </RenderTracker>
  );
}

function StepExplanation({
  step,
  setStep,
}: {
  step: StepType;
  setStep: (step: StepType) => void;
}) {
  switch (step) {
    case "baseline":
      return (
        <div className="space-y-2 p-4 border rounded-lg bg-purple-100 shadow-lg shadow-purple-300/20 ring-2 ring-purple-300">
          <h3 className="font-semibold">Step 1 – Baseline (no memo)</h3>
          <p className="text-xs text-gray-600">
            You'll notice every time the pick-up location changes, the
            ProductList re-renders.
          </p>
          <p className="text-xs text-gray-600">
            When the pick-up location changes, the products array is recreated,
            so ProductList sees a new products prop and re-renders. Surely,
            memoising products would prevent those unnecessary re-renders.
          </p>
          <p className="text-xs text-gray-600">
            <strong>Solution:</strong> Let's memoise the products prop.
          </p>
          <Button size="sm" onClick={() => setStep("memoiseProp")}>
            Next
          </Button>
        </div>
      );
    case "memoiseProp":
      return (
        <div className="space-y-2 p-4 border rounded-lg bg-purple-100 shadow-lg shadow-purple-300/20 ring-2 ring-purple-300">
          <h3 className="font-semibold">Step 2 – Memoise the products prop</h3>
          <p className="text-xs text-gray-600">
            You'll notice that the ProductList still re-renders despite us
            memoising the one prop, products, that it depends on.
          </p>
          <p className="text-xs text-gray-600">
            Why isn't our memoisation working? Well, in order for the
            memoisation to be effective we have to memoise the component as
            well.
          </p>
          <p className="text-xs text-gray-600">
            <strong>Solution:</strong> Let's use React.memo to memoise the
            ProductList component.
          </p>
          <Button size="sm" onClick={() => setStep("memoiseComponent")}>
            Next
          </Button>
        </div>
      );
    case "memoiseComponent":
      return (
        <div className="space-y-2 p-4 border rounded-lg bg-purple-100 shadow-lg shadow-purple-300/20 ring-2 ring-purple-300">
          <h3 className="font-semibold">Step 3 – Memoise the component</h3>
          <p className="text-xs text-gray-600">
            Well, would you look at that! You'll notice that the ProductList no
            longer re-renders when the pick-up location changes.
          </p>
          <p className="text-xs text-gray-600">
            Finally our memoisation is working. You will notice that we still
            memoise the products prop passed to the ProductList component.
          </p>
        </div>
      );
  }
  return <div></div>;
}

function ProductList({ products }: { products: Product[] }) {
  return (
    <RenderTracker
      name={`ProductList`}
      className="bg-white"
      flashClassName="bg-blue-200 shadow-lg shadow-blue-500/50 ring-2 ring-blue-400"
    >
      <div className="p-4 border rounded-lg">
        <h4 className="font-semibold mb-2">Shopping List</h4>
        <div className="space-y-2">
          <div className="overflow-y-auto space-y-1">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between text-xs h-4 bg-gray-100/80 rounded-lg p-4 border border-gray-200"
              >
                <span>
                  {product.name} - ${product.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RenderTracker>
  );
}

function ShoppingLocationSelector({
  location,
  setLocation,
}: {
  location:
    | "island_bay"
    | "wellington_central"
    | "wellington_airport"
    | "wellington_west";
  setLocation: (
    location:
      | "island_bay"
      | "wellington_central"
      | "wellington_airport"
      | "wellington_west"
  ) => void;
}) {
  return (
    <RenderTracker
      name={`Location`}
      className="bg-white"
      flashClassName="bg-orange-200 shadow-lg shadow-orange-500/50 ring-2 ring-orange-400"
    >
      <div className="space-y-2 p-4 border rounded-lg">
        <label className="text-sm text-gray-600">
          Select a pick up location:
          <select
            className="w-full bg-white border border-gray-300 rounded-md p-2 text-sm"
            value={location}
            onChange={(e) => setLocation(e.target.value as typeof location)}
          >
            <option value="island_bay">Island Bay</option>
            <option value="wellington_central">Wellington Central</option>
            <option value="wellington_airport">Wellington Airport</option>
            <option value="wellington_west">Wellington West</option>
          </select>
        </label>
      </div>
    </RenderTracker>
  );
}
