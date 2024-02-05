// /frontend/components/ProductList.tsx
import React from 'react';
import { Product } from '../types'; // Assuming Product type is defined

interface ProductListProps {
    products: Product[];
    onSelect: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onSelect }) => {
    return (
        <ul>
            {products.map((product) => (
                <li key={product.id} onClick={() => onSelect(product.id)}>
                    {product.name}
                </ul>
            ))}
        </ul>
    );
};

export default ProductList;
