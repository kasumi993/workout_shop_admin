import MainLayout from "@/layouts/MainLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteProductPage() {
    const router = useRouter();
    const {id} = router.query;
    const [productInfo, setProductInfo] = useState(null);

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

    function goBack() {
        router.push('/products');
    }

    function deleteProduct() { 
        axios.delete(`/api/products?id=${id}`).then(() => {
            goBack();
        })
    }

    return (
        <MainLayout>
            {productInfo && (
                <div>
                    <h1>Delete Product</h1>
                    <h2> Do you really want to delete product {productInfo.title} </h2>
                    <button className="btn-red" onClick={deleteProduct}>Yes</button>
                    <button className="btn-default" onClick={goBack}>No</button>
                </div>
            )}
        </MainLayout>
    )
}