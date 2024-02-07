// /frontend/components/ProductList.tsx
import React from 'react';
import { Product } from '../types'; // Importing the Product interface

interface ProductListProps {
  products: Product[];
  onSelect: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onSelect }) => {
  if (products.length === 0) {
    return <p>No products available.</p>;
  }

  return (
    <ul className="product-list">
      {products.map((product) => (
        <li 
          key={product.id} 
          onClick={() => onSelect(product.id)}
          className={`product-item ${product.isActive ? 'active' : 'inactive'}`}
          title="Click to view product details"
        >
          <div className="product-name">{product.name}</div>
          <div className="product-price">${product.price.toFixed(2)}</div>
          {product.stockLevel <= 0 && <span className="out-of-stock">Out of Stock</span>}
        </li>
      ))}
    </ul>
  );
};

export default ProductList;