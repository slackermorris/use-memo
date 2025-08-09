const CODE_BASELINE = `function ShoppingApp() {
  const [location, setLocation] = useState<LocationType>("island_bay");

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
  const [location, setLocation] = useState<LocationType>("island_bay");

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
  const [location, setLocation] = useState<LocationType>("island_bay");

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

const CODE_MEMOISE_PROP_WITH_DEPENDENCY = `
const MemoisedProductList = React.memo(ProductList);

function ShoppingApp({ suggestedProducts }: { suggestedProducts: (typeof PRODUCTS)[number] }) {
  const [location, setLocation] = useState<LocationType>("island_bay");

  const products = useMemo(() => {
  return [...PRODUCTS, ...suggestedProducts];
  }, [suggestedProducts]);

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

export {
  CODE_BASELINE,
  CODE_MEMOISE_PROP,
  CODE_MEMOISE_COMPONENT,
  CODE_MEMOISE_PROP_WITH_DEPENDENCY,
};
