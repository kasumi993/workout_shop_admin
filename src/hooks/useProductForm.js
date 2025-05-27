import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import ProductsService from "@/services/productsService";
import { useToast } from "@/components/GlobalComponents/Notifications";

export function useProductForm(productId) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const saveProduct = useCallback(async (productData) => {
    // Validation
    if (!productData.title.trim()) {
      toast.error('Error', 'Product name is required');
      return false;
    }
    
    if (!productData.price || parseFloat(productData.price) <= 0) {
      toast.error('Error', 'Valid price is required');
      return false;
    }
    
    setLoading(true);
    
    try {
      const data = {
        title: productData.title.trim(),
        description: productData.description.trim(),
        price: parseFloat(productData.price),
        images: productData.images,
        categoryId: productData.categoryId || null,
        properties: productData.properties
      };
      
      if (productId) {
        await ProductsService.updateProduct(productId, data);
        toast.success('Success', 'Product updated successfully');
      } else {
        await ProductsService.createProduct(data);
        toast.success('Success', 'Product created successfully');
      }
      
      router.push('/products');
      return true;
    } catch (error) {
      console.error('Failed to save product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save product';
      toast.error('Error', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [productId, router, toast]);

  return { saveProduct, loading };
}