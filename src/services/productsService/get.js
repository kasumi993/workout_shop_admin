import api from '@/lib/api';

/**
 * Fetches products from the backend with pagination and search support
 */
export const getProducts = async (params = {}) => {
    try {
        // Build query string from parameters
        const searchParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, value.toString());
            }
        });
        
        const queryString = searchParams.toString();
        const url = queryString ? `/products?${queryString}` : '/products';
        
        const response = await api.get(url);
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

