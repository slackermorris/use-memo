const CODE_BASELINE = `
function ShoppingApp() {
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

function ShoppingApp({ suggestedProducts }: { suggestedProducts: Array<Products> }) {
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
