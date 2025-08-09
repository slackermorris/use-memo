import { useState, memo, useMemo } from "react";
import { Button } from "../Button";
import { RenderTracker } from "../RenderTracker";
import { CodeBlock } from "../CodeBlock";
import {
  CODE_BASELINE,
  CODE_MEMOISE_PROP,
  CODE_MEMOISE_COMPONENT,
  CODE_MEMOISE_PROP_WITH_DEPENDENCY,
} from "./code";
import { BaselineStepExplanation } from "./broken-memo/Baseline";
import { MemoisePropStepExplanation } from "./broken-memo/MemoiseProp";
import { MemoiseComponentStepExplanation } from "./broken-memo/MemoiseComponent";
import { MemoisePropWithDependencyStepExplanation } from "./broken-memo/MemoisePropWithDependency";

export type StepType =
  | "baseline"
  | "memoiseProp"
  | "memoiseComponent"
  | "memoisePropWithDependency";

type LocationType =
  | "island_bay"
  | "wellington_central"
  | "wellington_airport"
  | "wellington_west";

// // Theme context used to demonstrate how Providers can break memoization if value is unstable
// const ThemeContext = createContext<{ mode: "light" | "dark" }>({
//   mode: "light",
// });
// const useTheme = () => useContext(ThemeContext);

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
    <div className="space-y-4">
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <MemoStepButtons step={step} setStep={setStep} />
            <CodeRenderer step={step} />
          </div>

          <ShoppingAppRenderer step={step} setStep={setStep} />
        </div>
      </div>
    </div>
  );
}

function MemoStepButtons({
  step,
  setStep,
}: {
  step: StepType;
  setStep: (step: StepType) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {[
        { id: "baseline", label: "Baseline" },
        { id: "memoiseProp", label: "Memoise Prop" },
        { id: "memoiseComponent", label: "Memoise Component" },
        {
          id: "memoisePropWithDependency",
          label: "Memoise Prop with Dependency",
        },
      ].map((s) => (
        <Button
          key={s.id}
          size="sm"
          variant={step === (s.id as typeof step) ? "primary" : "secondary"}
          onClick={() => setStep(s.id as typeof step)}
        >
          {s.label}
        </Button>
      ))}
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
        <CodeBlock code={CODE_MEMOISE_PROP} title="Step 2 – Memoise Prop" />
      );
    case "memoiseComponent":
      return (
        <CodeBlock
          code={CODE_MEMOISE_COMPONENT}
          title="Step 3 – Memoise Component"
        />
      );
    case "memoisePropWithDependency":
      return (
        <CodeBlock
          code={CODE_MEMOISE_PROP_WITH_DEPENDENCY}
          title="Step 4 – Memoise Prop with Dependency"
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
  const [hasChangedLocation, setHasChangedLocation] = useState<{
    [key in StepType]: boolean;
  }>({
    baseline: false,
    memoiseProp: false,
    memoiseComponent: false,
    memoisePropWithDependency: false,
  });

  const handleStepChange = (step: StepType) => {
    setStep(step);
  };

  return (
    <div className="space-y-4">
      <StepExplanation
        step={step}
        setStep={handleStepChange}
        hasChangedLocation={hasChangedLocation[step]}
      />

      {step === "baseline" ? (
        <ShoppingAppNoMemo
          setHasChangedLocation={(hasChangedLocation) =>
            setHasChangedLocation((prev) => ({
              ...prev,
              baseline: hasChangedLocation,
            }))
          }
        />
      ) : step === "memoiseProp" ? (
        <ShoppingAppMemoProp
          setHasChangedLocation={(hasChangedLocation) =>
            setHasChangedLocation((prev) => ({
              ...prev,
              memoiseProp: hasChangedLocation,
            }))
          }
        />
      ) : step === "memoiseComponent" ? (
        <ShoppingAppMemoComponent
          setHasChangedLocation={(hasChangedLocation) =>
            setHasChangedLocation((prev) => ({
              ...prev,
              memoiseComponent: hasChangedLocation,
            }))
          }
        />
      ) : step === "memoisePropWithDependency" ? (
        <ShoppingAppMemoPropWithDependency
          setHasChangedLocation={(hasChangedLocation) =>
            setHasChangedLocation((prev) => ({
              ...prev,
              memoisePropWithDependency: hasChangedLocation,
            }))
          }
        />
      ) : null}
    </div>
  );
}

function ShoppingAppNoMemo({
  setHasChangedLocation,
}: {
  setHasChangedLocation: (hasChangedLocation: boolean) => void;
}) {
  const [location, setLocation] = useState<LocationType>("island_bay");

  const products = PRODUCTS;

  const handleLocationChange = (location: LocationType) => {
    setLocation(location);
    setHasChangedLocation(true);
  };

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
            setLocation={handleLocationChange}
          />

          <ProductList products={products} />
        </div>
      </div>
    </RenderTracker>
  );
}

function ShoppingAppMemoProp({
  setHasChangedLocation,
}: {
  setHasChangedLocation: (hasChangedLocation: boolean) => void;
}) {
  const [location, setLocation] = useState<LocationType>("island_bay");

  const products = useMemo(() => PRODUCTS, []);

  const handleLocationChange = (location: LocationType) => {
    setLocation(location);
    setHasChangedLocation(true);
  };

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
            setLocation={handleLocationChange}
          />

          <ProductList products={products} />
        </div>
      </div>
    </RenderTracker>
  );
}

const MemoisedProductList = memo(ProductList);

function ShoppingAppMemoComponent({
  setHasChangedLocation,
}: {
  setHasChangedLocation: (hasChangedLocation: boolean) => void;
}) {
  const [location, setLocation] = useState<LocationType>("island_bay");

  const products = useMemo(() => PRODUCTS, []);

  const handleLocationChange = (location: LocationType) => {
    setLocation(location);
    setHasChangedLocation(true);
  };

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
            setLocation={handleLocationChange}
          />

          <MemoisedProductList products={products} />
        </div>
      </div>
    </RenderTracker>
  );
}

function ShoppingAppMemoPropWithDependency({
  setHasChangedLocation,
}: {
  setHasChangedLocation: (hasChangedLocation: boolean) => void;
}) {
  const [location, setLocation] = useState<LocationType>("island_bay");

  const suggestedProducts = [
    {
      id: 1,
      name: "Product 1",
      price: 100,
      category: "electronics",
      inStock: true,
    },
  ];

  const handleLocationChange = (location: LocationType) => {
    setLocation(location);
    setHasChangedLocation(true);
  };

  return (
    <ShoppingAppMemoPropWithDependencyChild
      location={location}
      suggestedProducts={suggestedProducts}
      setLocation={handleLocationChange}
      setHasChangedLocation={setHasChangedLocation}
    />
  );
}

function ShoppingAppMemoPropWithDependencyChild({
  location,
  setLocation,
  suggestedProducts,
  setHasChangedLocation,
}: {
  location: LocationType;
  setLocation: (location: LocationType) => void;
  suggestedProducts: (typeof PRODUCTS)[number][];
  setHasChangedLocation: (hasChangedLocation: boolean) => void;
}) {
  const products = useMemo(() => {
    return [...PRODUCTS, ...suggestedProducts];
  }, [suggestedProducts]);

  const handleLocationChange = (location: LocationType) => {
    setLocation(location);
    setHasChangedLocation(true);
  };

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
            setLocation={handleLocationChange}
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
  hasChangedLocation,
}: {
  step: StepType;
  setStep: (step: StepType) => void;
  hasChangedLocation: boolean;
}) {
  switch (step) {
    case "baseline":
      return (
        <BaselineStepExplanation
          hasChangedLocation={hasChangedLocation}
          setStep={setStep}
        />
      );
    case "memoiseProp":
      return (
        <MemoisePropStepExplanation
          hasChangedLocation={hasChangedLocation}
          setStep={setStep}
        />
      );
    case "memoiseComponent":
      return (
        <MemoiseComponentStepExplanation
          hasChangedLocation={hasChangedLocation}
          setStep={setStep}
        />
      );
    case "memoisePropWithDependency":
      return (
        <MemoisePropWithDependencyStepExplanation
          hasChangedLocation={hasChangedLocation}
          setStep={setStep}
        />
      );
  }
  return <div></div>;
}

function ProductList({ products }: { products: (typeof PRODUCTS)[0][] }) {
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
