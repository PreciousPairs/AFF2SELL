import React from 'react';
import { useProducts } from '../hooks/useProducts';

const ProductsPage: React.FC = () => {
    const { products, isLoading, isError, errorMessage, refreshProducts } = useProducts();

    return (
        <div>
            <h1>Products</h1>
            {isLoading && <p>Loading products...</p>}
            {isError && <p>Error: {errorMessage}</p>}
            <ul>
                {products.map(product => (
                    <li key={product.id}>{product.name} - ${product.price}</li>
                ))}
            </ul>
            <button onClick={refreshProducts}>Refresh Products</button>
        </div>
    );
};

export default ProductsPage;
