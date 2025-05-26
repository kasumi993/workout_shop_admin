import MainLayout from "@/layouts/MainLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductsService from "@/services/productsService";
import { useToast } from "@/components/GlobalComponents/Notifications";
import Spinner from "@/components/GlobalComponents/BouncingSpinner";

export default function DeleteProductPage() {
    const router = useRouter();
    const { id } = router.query;
    const [productInfo, setProductInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
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

    function goBack() {
        router.push('/products');
    }

    async function deleteProduct() {
        try {
            setDeleting(true);
            await ProductsService.deleteProduct(id[0]);
            toast.success('Success', 'Product deleted successfully');
            goBack();
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error('Error', 'Failed to delete product');
            setDeleting(false);
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
            {productInfo && (
                <div>
                    <h1>Delete Product</h1>
                    <h2>Do you really want to delete product &quot;{productInfo.title}&quot;?</h2>
                    <div className="flex gap-2 mt-4">
                        <button 
                            className="btn-red" 
                            onClick={deleteProduct}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                        <button 
                            className="btn-default" 
                            onClick={goBack}
                            disabled={deleting}
                        >
                            No, Cancel
                        </button>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}