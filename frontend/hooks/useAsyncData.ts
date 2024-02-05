import { useState, useCallback } from 'react';

interface AsyncData<T> {
    data: T | null;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    fetchData: (params?: any) => Promise<void>;
}

export const useAsyncData = <T,>(asyncFunction: (params?: any) => Promise<T>): AsyncData<T> => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const fetchData = useCallback(async (params?: any) => {
        setIsLoading(true);
        setIsError(false);
        setErrorMessage('');
        try {
            const result = await asyncFunction(params);
            setData(result);
        } catch (error) {
            setIsError(true);
            setErrorMessage(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [asyncFunction]);

    return { data, isLoading, isError, errorMessage, fetchData };
};
