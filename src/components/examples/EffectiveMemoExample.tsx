import { useState, useCallback, memo, useMemo } from "react";
import { Button } from "../Button";
import { RenderTracker } from "../RenderTracker";
import { CodeBlock } from "../CodeBlock";

// Simulate a large product database (same as broken example)
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

// ✅ Properly memoized component with useMemo for expensive computation
const ProductList = memo(function ProductList({
  products,
  searchTerm,
  onAddToCart,
}: {
  products: Product[];
  searchTerm: string;
  onAddToCart: (product: Product) => void;
}) {
  // ✅ Expensive operation is memoized
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <RenderTracker
      name="ProductList"
      className="p-4 border border-green-200 rounded-lg bg-green-50"
    >
      <h4 className="font-semibold text-green-800 mb-2">
        Product List (Properly Memoized)
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

// ✅ Memoized parent component
const ShoppingCart = memo(function ShoppingCart({
  products,
  searchTerm,
}: {
  products: Product[];
  searchTerm: string;
}) {
  const [cart, setCart] = useState<Product[]>([]);

  // ✅ Stable callback using useCallback without cart dependency
  const addToCart = useCallback((product: Product) => {
    setCart((prev) => [...prev, product]);
  }, []); // No dependencies - stable reference

  return (
    <RenderTracker name="ShoppingCart" className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold mb-2">Shopping Cart (Memoized Parent)</h3>
        <p className="text-sm text-gray-600 mb-4">
          This component demonstrates effective memoization:
        </p>
        <ul className="text-sm text-gray-600 space-y-1 mb-4">
          <li>✅ Child component is memoized</li>
          <li>✅ Expensive filtering is memoized with useMemo</li>
          <li>✅ The 'products' prop is referentially stable</li>
          <li>✅ The 'addToCart' callback is stable</li>
          <li>✅ This parent component is also memoized</li>
        </ul>
        <p className="text-xs text-blue-600">Cart items: {cart.length}</p>
      </div>

      <ProductList
        products={products}
        searchTerm={searchTerm}
        onAddToCart={addToCart}
      />
    </RenderTracker>
  );
});

const effectiveCode = `// ✅ EFFECTIVE: Proper memoization chain
function ShoppingApp() {
  const [counter, setCounter] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  
  // ✅ Stable reference with useMemo
  const products = useMemo(() => 
    PRODUCTS_DB.filter(p => p.inStock), []
  );
  
  return <MemoizedShoppingCart products={products} searchTerm={searchTerm} />;
}

// ✅ All components memoized
const MemoizedShoppingCart = memo(function ShoppingCart({ products, searchTerm }) {
  const addToCart = useCallback((product) => {
    setCart(prev => [...prev, product]);
  }, []); // ✅ No dependencies - stable callback
  
  return <MemoizedProductList products={products} onAddToCart={addToCart} />;
});

const MemoizedProductList = memo(function ProductList({ products, searchTerm, onAddToCart }) {
  // ✅ Expensive operation memoized
  const filteredProducts = useMemo(() => 
    products.filter(p => p.name.includes(searchTerm)), 
    [products, searchTerm]
  );
  
  return <div>...</div>;
});`;

export function EffectiveMemoExample() {
  const [counter, setCounter] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [productCount, setProductCount] = useState(800);

  // ✅ This creates a stable reference using useMemo
  const products = useMemo(
    () =>
      PRODUCTS_DB.filter((product) => product.inStock).slice(0, productCount),
    [productCount]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Effective Memoization</h3>
              <p className="text-sm text-gray-600">
                Counter: {counter} | Products: {products.length}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setCounter((c) => c + 1)} size="sm">
                Increment Counter
              </Button>
              <Button
                onClick={() => setProductCount((c) => c + 100)}
                size="sm"
                variant="secondary"
              >
                More Products
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Search Products:
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Watch the render counters</strong> on the right. Notice
                how the ShoppingCart component only re-renders when products
                change, NOT when the counter changes!
              </p>
              <p className="text-sm text-gray-600">
                The expensive filtering only runs when products or searchTerm
                change, thanks to proper memoization.
              </p>
            </div>
          </div>
        </div>

        <div>
          <ShoppingCart products={products} searchTerm={searchTerm} />
        </div>
      </div>

      <CodeBlock
        code={effectiveCode}
        title="✅ Effective Memoization Code"
        className="mt-6"
      />
    </div>
  );
}
