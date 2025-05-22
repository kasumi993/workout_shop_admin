import api from '/lib/api';
import { API_URL } from '../../config';

/**
 * Fetches categories from the backend
 * 
 * @param {Object} options - Request options
 * @param {Object} options.params - URL parameters
 * @returns {Promise<Array>} - Promise with the categories data
 */
export const getCategories = async (options = {}) => {
    try {
        const response = await api.get(`${API_URL}/categories`, options);
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
        const response = await api.get(`${API_URL}/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching category with ID ${id}:`, error);
        throw error;
    }
};