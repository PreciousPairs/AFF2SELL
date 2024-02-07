import React from 'react';
import { useProducts } from '../hooks/useProducts';
import LoadingIndicator from '../components/common/LoadingIndicator'; // Import LoadingIndicator component for displaying loading state
import ErrorMessage from '../components/common/ErrorMessage'; // Import ErrorMessage component for displaying error message

const ProductsPage: React.FC = () => {
    const { products, isLoading, isError, errorMessage, refreshProducts } = useProducts();

    return (
        <div>
            <h1>Products</h1>
            {/* Display loading indicator when products are being fetched */}
            {isLoading && <LoadingIndicator />}
            {/* Display error message if fetching products fails */}
            {isError && <ErrorMessage message={errorMessage} />}
            <ul>
                {products.map(product => (
                    <li key={product.id}>{product.name} - ${product.price}</li>
                ))}
            </ul>
            {/* Disable refresh button while products are being refreshed */}
            <button onClick={refreshProducts} disabled={isLoading}>Refresh Products</button>
        </div>
    );
};

export default ProductsPage;

// Enhance ProductsPage component with TypeScript interfaces
interface Product {
    id: number;
    name: string;
    price: number;
}

// Define props for ErrorMessage component
interface ErrorMessageProps {
    message: string;
}

// ErrorMessage component to display error message
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return <p style={{ color: 'red' }}>{message}</p>;
};

// Import useProducts hook from ../hooks/useProducts
import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/productService';

// useProducts custom hook for fetching and managing products data
export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Function to fetch products
    const refreshProducts = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const fetchedProducts = await fetchProducts(); // Assuming fetchProducts is a function to fetch products from a service
            setProducts(fetchedProducts);
        } catch (error) {
            setIsError(true);
            setErrorMessage('Failed to fetch products. Please try again later.');
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect hook to fetch products on component mount
    useEffect(() => {
        refreshProducts();
    }, []);

    return { products, isLoading, isError, errorMessage, refreshProducts };
};