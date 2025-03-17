import MainLayout from "@/layouts/MainLayout";
import ProductForm from "@/components/Products/ProductForm";

export default function NewProduct() {
    return (
        <MainLayout>
             <h1>New Product</h1>
             <ProductForm />
        </MainLayout>
    );
}