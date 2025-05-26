import api from '@/lib/api';

/**
 * Deletes a products by its ID
 * @param {string|number} productId - The ID of the product to delete
 * @returns {Promise<Object>} - A promise that resolves to the API response
 * @throws {Error} - Throws an error if the deletion fails
 */
export const deleteProduct = async (productId) => {
    try {
        if (!productId) {
            throw new Error('Product ID is required');
        }

        const response = await api.delete(`/products/${productId}`);
        
        return response.data;
    } catch (error) {
        console.error('Failed to delete product:', error);
        throw error;
    }
};

export default deleteProduct;