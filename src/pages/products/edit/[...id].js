import MainLayout from '@/layouts/MainLayout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductForm from '@/components/Products/ProductForm';
import ProductsService from '@/services/productsService';
import Spinner from '@/components/GlobalComponents/BouncingSpinner';
import { useToast } from '@/components/GlobalComponents/Notifications';

export default function EditProductPage() {
    const [productInfo, setProductInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query;
    const toast = useToast();

    useEffect(() => {
        if (!id || !id[0]) {
            return;
        }
        
        fetchProduct(id[0]);
    }, [id]);

    async function fetchProduct(productId) {
        try {
            setLoading(true);
            const response = await ProductsService.getProductById(productId);
            setProductInfo(response);
        } catch (error) {
            console.error('Failed to fetch product:', error);
            toast.error('Error', 'Failed to load product');
            // Redirect back to products list if product not found
            if (error.response?.status === 404) {
                router.push('/products');
            }
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center py-8">
                    <Spinner />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <h1>Edit Product</h1>
            {productInfo && (
                <ProductForm {...productInfo} />
            )}
        </MainLayout>
    );
}