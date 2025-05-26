import api from '@/lib/api';

/**
 * Fetches categories from the backend
 */
export const getCategories = async () => {
    try {
        const response = await api.get(`/categories`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

/**
 * Fetches a single category by ID
 * 
 * @param {string|number} id - Category ID
 * @returns {Promise<Object>} - Promise with the category data
 */
export const getCategoryById = async (id) => {
    try {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching category with ID ${id}:`, error);
        throw error;
    }
};