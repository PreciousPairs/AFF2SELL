// /frontend/pages/ProductDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../services/ProductService';
import Notifier from '../components/common/Notifier';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<any | null>(null); // Define a more specific type for your product
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchedProduct = await ProductService.fetchProductById(productId);
                setProduct(fetchedProduct);
            } catch (error) {
                Notifier.notifyError('Failed to fetch product details');
            }
        };
        fetchProduct();
    }, [productId]);

    const handleDelete = async () => {
        try {
            await ProductService.deleteProduct(productId);
            Notifier.notifySuccess('Product successfully deleted');
            navigate('/');
        } catch (error) {
            Notifier.notifyError('Failed to delete product');
        }
    };

    // Add form and logic for updating product details

    return (
        <div>
            <h1>Product Details</h1>
            {product && (
                <>
                    <p>{product.name}</p>
                    <p>{product.description}</p>
                    {/* Display more product details */}
                    <button onClick={handleDelete}>Delete Product</button>
                    {/* Add button and functionality for editing product details */}
                </>
            )}
        </div>
    );
};

export default ProductDetailPage;
