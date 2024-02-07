import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../services/ProductService';
import Notifier from '../components/common/Notifier';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ErrorMessage from '../components/common/ErrorMessage';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate();

    const productSchema = yup.object({
        name: yup.string().required('Product name is required'),
        description: yup.string().required('Product description is required'),
        // Define additional fields and validation as needed
    }).required();

    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm({
        resolver: yupResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            // Initialize other fields as needed
        }
    });

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const fetchedProduct = await ProductService.fetchProductById(productId);
                setProduct(fetchedProduct);
                reset(fetchedProduct);
            } catch (error) {
                setIsError(true);
                setErrorMessage('Failed to fetch product details');
                Notifier.notifyError('Failed to fetch product details');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [productId, reset]);

    const handleDelete = async () => {
        try {
            await ProductService.deleteProduct(productId);
            Notifier.notifySuccess('Product successfully deleted');
            navigate('/');
        } catch (error) {
            Notifier.notifyError('Failed to delete product');
        }
    };

    const handleUpdate = async (data: any) => {
        try {
            await ProductService.updateProduct(productId, data);
            Notifier.notifySuccess('Product successfully updated');
            navigate('/');
        } catch (error) {
            Notifier.notifyError('Failed to update product');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Implement upload logic, possibly using a service like AWS S3, Firebase, etc.
            // Set image URL in form state or product state after upload
            Notifier.notifyWarning('Image upload functionality is under development');
        }
    };

    if (isLoading) return <LoadingIndicator />;
    if (isError) return <ErrorMessage message={errorMessage} />;

    return (
        <div>
            <h1>Product Details</h1>
            {product && (
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <label htmlFor="name">Name:</label>
                    <input id="name" {...register('name')} />
                    {errors.name && <p>{errors.name.message}</p>}
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" {...register('description')} />
                    {errors.description && <p>{errors.description.message}</p>}
                    {/* Add more fields as needed */}
                    <input type="file" onChange={handleImageUpload} />
                    {/* Image upload functionality */}
                    <button type="submit">Save Changes</button>
                </form>
            )}
            <button onClick={handleDelete}>Delete Product</button>
            {/* Remove the old update button, as the form now handles updates */}
            <div className="product-preview">
                <h2>Preview</h2>
                <p><strong>Name:</strong> {watch('name')}</p>
                <p><strong>Description:</strong> {watch('description')}</p>
                {/* Display additional fields and possibly an image preview */}
            </div>
        </div>
    );
};

export default ProductDetailPage;