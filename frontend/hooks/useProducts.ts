import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
}

interface ProductsState {
    products: Product[];
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    refreshProducts: () => Promise<void>;
}

export const useProducts = (): ProductsState => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        setErrorMessage('');

        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            setIsError(true);
            setErrorMessage(error.response?.data?.message || 'Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const refreshProducts = useCallback(async () => {
        await fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        isLoading,
        isError,
        errorMessage,
        refreshProducts,
    };
};
