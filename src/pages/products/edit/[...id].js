import MainLayout from '@/layouts/MainLayout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductForm from '@/components/Products/ProductForm';
import axios from 'axios';

export default function EditProductPage() {
    const [productInfo, setProductInfo] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        else {
            axios.get(`/api/products?id=${id}`).then(response => {
                setProductInfo(response.data);
            })
        }
    }, [id]);

    return (
        <MainLayout>
            <h1>Edit Product {id}</h1>
            {productInfo && (
                <ProductForm {...productInfo} />
            )}
        </MainLayout>
    );
}