import api from '@/lib/api';

/**
 * Updates a product
 */
const updateProduct = async (id, productData) => {
    try {
        const response = await api.patch(`/products/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export default updateProduct;
