// /frontend/components/ProductList.tsx

// Add a new prop for handling selection
interface ProductListProps {
  products: Product[]; // Assuming Product type is defined
  onSelect: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onSelect }) => {
  return (
    <div>
      {products.map((product) => (
        <div key={product.id} onClick={() => onSelect(product.id)}>
          {/* Render product information */}
          <p>{product.name}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
