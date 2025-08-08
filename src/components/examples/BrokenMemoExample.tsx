import {
  useState,
  useCallback,
  memo,
  useMemo,
  createContext,
  useContext,
} from "react";
import { Button } from "../Button";
import { RenderTracker } from "../RenderTracker";
import { CodeBlock } from "../CodeBlock";

// Simulate a large product database
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

// Theme context used to demonstrate how Providers can break memoization if value is unstable
const ThemeContext = createContext<{ mode: "light" | "dark" }>({
  mode: "light",
});
const useTheme = () => useContext(ThemeContext);

// Child list (not memoized) – performs expensive filtering every render
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

// Same child wrapped with React.memo (will only skip if props are referentially stable)
const MemoizedProductList = memo(function MemoizedProductList({
  products,
  searchTerm,
  onAddToCart,
}: {
  products: Product[];
  searchTerm: string;
  onAddToCart: (product: Product) => void;
}) {
  // still does the expensive operation when it renders
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const theme = useTheme();

  return (
    <RenderTracker
      name={`MemoizedProductList (${theme.mode})`}
      className="p-4 border border-yellow-200 rounded-lg bg-yellow-50"
    >
      <h4 className="font-semibold text-yellow-800 mb-2">
        Product List (Memoized)
      </h4>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
        <div className="max-h-32 overflow-y-auto space-y-1">
          {filteredProducts.slice(0, 5).map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between text-xs"
            >
              <span>
                {product.name} - ${product.price}
              </span>
              <Button onClick={() => onAddToCart(product)} size="sm">
                +
              </Button>
            </div>
          ))}
          {filteredProducts.length > 5 && (
            <p className="text-xs text-gray-500">
              ...and {filteredProducts.length - 5} more
            </p>
          )}
        </div>
      </div>
    </RenderTracker>
  );
});

function Demo_Baseline({ products }: { products: Product[] }) {
  return (
    <RenderTracker name="ShoppingApp (Baseline)">
      <ProductList products={products} />
    </RenderTracker>
  );
}

function Demo_MemoiseProp({ products }: { products: Product[] }) {
  return (
    <RenderTracker name="ShoppingApp (memoise prop)">
      <ProductList products={products} />
    </RenderTracker>
  );
}

// 2) useCallback only: stable handler, but child isn't memoized
function Demo_UseCallbackOnly({
  products,
  searchTerm,
}: {
  products: Product[];
  searchTerm: string;
}) {
  const [cart, setCart] = useState<Product[]>([]);
  const onAddToCart = useCallback(
    (p: Product) => setCart((prev) => [...prev, p]),
    []
  );
  return (
    <RenderTracker name="ShoppingApp (useCallback only)" className="space-y-4">
      <div className="p-4 border rounded-lg bg-white">
        <h3 className="font-semibold">useCallback only</h3>
        <p className="text-xs text-gray-600">
          Doesn't help because child isn't memoized and parent still re-renders.
        </p>
      </div>
      <ProductList
        products={products}
        searchTerm={searchTerm}
        onAddToCart={onAddToCart}
      />
      <p className="text-xs text-blue-600">Cart items: {cart.length}</p>
    </RenderTracker>
  );
}

// 3) Memoized child only: child wrapped in memo, but props are unstable (new array)
function Demo_MemoChildOnly({
  products,
  searchTerm,
}: {
  products: Product[];
  searchTerm: string;
}) {
  const [cart, setCart] = useState<Product[]>([]);
  const onAddToCart = useCallback(
    (p: Product) => setCart((prev) => [...prev, p]),
    []
  );
  return (
    <RenderTracker name="ShoppingApp (memo child only)" className="space-y-4">
      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold">React.memo only</h3>
        <p className="text-xs text-gray-600">
          Still re-renders because props (products) change reference on each
          render.
        </p>
      </div>
      <MemoizedProductList
        products={products}
        searchTerm={searchTerm}
        onAddToCart={onAddToCart}
      />
      <p className="text-xs text-blue-600">Cart items: {cart.length}</p>
    </RenderTracker>
  );
}

// 4) Stable props + memo chain: products and handler are stable, child memoized – counter no longer re-renders list
function Demo_StablePropsChain({
  products,
  searchTerm,
}: {
  products: Product[];
  searchTerm: string;
}) {
  const [cart, setCart] = useState<Product[]>([]);
  const onAddToCart = useCallback(
    (p: Product) => setCart((prev) => [...prev, p]),
    []
  );
  const stableProducts = useMemo(() => products, [products]);
  return (
    <RenderTracker
      name="ShoppingApp (stable props + memo)"
      className="space-y-4"
    >
      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold">Stable props + React.memo</h3>
        <p className="text-xs text-gray-600">
          Unrelated state changes no longer re-render the list.
        </p>
      </div>
      <MemoizedProductList
        products={stableProducts}
        searchTerm={searchTerm}
        onAddToCart={onAddToCart}
      />
      <p className="text-xs text-blue-600">Cart items: {cart.length}</p>
    </RenderTracker>
  );
}

// 5) Context breaks memo: Provider value recreated on every render → all consumers re-render
function Demo_ContextBreaks({
  products,
  searchTerm,
  dark,
}: {
  products: Product[];
  searchTerm: string;
  dark: boolean;
}) {
  const [cart, setCart] = useState<Product[]>([]);
  const onAddToCart = useCallback(
    (p: Product) => setCart((prev) => [...prev, p]),
    []
  );
  const theme: { mode: "light" | "dark" } = { mode: dark ? "dark" : "light" }; // ❌ new object each render
  return (
    <ThemeContext.Provider value={theme}>
      <RenderTracker name="ShoppingApp (context breaks)" className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Context breaks memo</h3>
          <p className="text-xs text-gray-600">
            Even with memoized child + stable props, changing Provider value
            causes re-render of all consumers.
          </p>
        </div>
        <MemoizedProductList
          products={products}
          searchTerm={searchTerm}
          onAddToCart={onAddToCart}
        />
        <p className="text-xs text-blue-600">Cart items: {cart.length}</p>
      </RenderTracker>
    </ThemeContext.Provider>
  );
}

// 6) Context fixed: memoize Provider value so unrelated renders don't change value
function Demo_ContextFixed({
  products,
  searchTerm,
  dark,
}: {
  products: Product[];
  searchTerm: string;
  dark: boolean;
}) {
  const [cart, setCart] = useState<Product[]>([]);
  const onAddToCart = useCallback(
    (p: Product) => setCart((prev) => [...prev, p]),
    []
  );
  const theme = useMemo<{ mode: "light" | "dark" }>(
    () => ({ mode: dark ? "dark" : "light" }),
    [dark]
  ); // ✅ stable between dark toggles
  return (
    <ThemeContext.Provider value={theme}>
      <RenderTracker name="ShoppingApp (context fixed)" className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Context value memoized</h3>
          <p className="text-xs text-gray-600">
            Now unrelated renders don't force consumers to re-render.
          </p>
        </div>
        <MemoizedProductList
          products={products}
          searchTerm={searchTerm}
          onAddToCart={onAddToCart}
        />
        <p className="text-xs text-blue-600">Cart items: {cart.length}</p>
      </RenderTracker>
    </ThemeContext.Provider>
  );
}

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

const CODE_CALLBACK_ONLY = `// useCallback only (doesn't help by itself)
function ShoppingApp() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartCount, setCartCount] = useState(0);
  const products = PRODUCTS_DB.filter(p => selectedCategory === 'all' || p.category === selectedCategory);

  const onAddToCart = useCallback(() => setCartCount(c => c + 1), []);

  return <ProductList products={products} searchTerm={selectedCategory} onAddToCart={onAddToCart} />;
}`;

const CODE_MEMO_CHILD_ONLY = `// React.memo only (child) – still re-renders
const MemoizedProductList = React.memo(ProductList);

function ShoppingApp() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const products = PRODUCTS_DB.filter(p => selectedCategory === 'all' || p.category === selectedCategory); // new array
  const onAddToCart = useCallback(() => {}, []);
  return <MemoizedProductList products={products} searchTerm={selectedCategory} onAddToCart={onAddToCart} />;
}`;

const CODE_STABLE_CHAIN = `// Stable props + memoized child – works
const MemoizedProductList = React.memo(ProductList);

function ShoppingApp() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartCount, setCartCount] = useState(0);

  const products = useMemo(() => (
    PRODUCTS_DB.filter(p => selectedCategory === 'all' || p.category === selectedCategory)
  ), [selectedCategory]); // stable between unrelated renders

  const onAddToCart = useCallback(() => setCartCount(c => c + 1), []);

  return <MemoizedProductList products={products} searchTerm={selectedCategory} onAddToCart={onAddToCart} />;
}`;

const CODE_CONTEXT_BREAKS = `// Context breaks memo if value is unstable
const ThemeContext = createContext({ mode: 'light' });
const MemoizedProductList = React.memo(ProductList);

function ShoppingApp() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const theme = { mode: 'light' }; // new object each render ❌
  const products = useMemo(() => PRODUCTS_DB, []);
  const onAddToCart = useCallback(() => {}, []);
  
  return (
    <ThemeContext.Provider value={theme}>
      <MemoizedProductList products={products} searchTerm={selectedCategory} onAddToCart={onAddToCart} />
    </ThemeContext.Provider>
  );
}`;

const CODE_CONTEXT_FIXED = `// Context value memoized – consumers don't re-render unnecessarily
const ThemeContext = createContext({ mode: 'light' });
const MemoizedProductList = React.memo(ProductList);

function ShoppingApp() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const theme = useMemo(() => ({ mode: 'light' }), []); // ✅ stable
  const products = useMemo(() => PRODUCTS_DB, []);
  const onAddToCart = useCallback(() => {}, []);
  
  return (
    <ThemeContext.Provider value={theme}>
      <MemoizedProductList products={products} searchTerm={selectedCategory} onAddToCart={onAddToCart} />
    </ThemeContext.Provider>
  );
}`;

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
  const [step, setStep] = useState<"baseline" | "memoiseProp">("baseline");

  const codeForStep = () => {
    switch (step) {
      case "baseline":
        return { title: "Step 1 – Baseline (no memo)", code: CODE_BASELINE };
      case "memoiseProp":
        return {
          title: "Step 2 – Memoise the products prop",
          code: CODE_MEMOISE_PROP,
        };
    }
  };

  const code = codeForStep();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "baseline", label: "Baseline" },
              { id: "memoiseProp", label: "Memoise the products prop" },
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
          <CodeBlock code={code.code} title={code.title} />
        </div>

        <ShoppingAppRenderer step={step} setStep={setStep} />
      </div>
    </div>
  );
}

function ShoppingAppRenderer({
  step,
  setStep,
}: {
  step: "baseline" | "memoiseProp";
  setStep: (step: "baseline" | "memoiseProp") => void;
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

function StepExplanation({
  step,
  setStep,
}: {
  step: string;
  setStep: (step: "baseline" | "memoiseProp") => void;
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
        </div>
      );
  }
  return <div></div>;
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
