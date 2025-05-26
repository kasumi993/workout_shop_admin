import api from '@/lib/api';

/**
 * Fetches products from the backend
 */
export const getProducts = async () => {
    try {
        const response = await api.get(`/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

/**
 * Fetches a single product by ID
 * 
 * @param {string|number} id - product ID
 * @returns {Promise<Object>} - Promise with the product data
 */
export const getProductById = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with ID ${id}:`, error);
        throw error;
    }
};