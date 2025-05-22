import api from '/lib/api';
import { API_BASE_URL } from '../../config';

/**
 * Deletes a category by its ID
 * @param {string|number} categoryId - The ID of the category to delete
 * @returns {Promise<Object>} - A promise that resolves to the API response
 * @throws {Error} - Throws an error if the deletion fails
 */
export const deleteCategory = async (categoryId) => {
    try {
        if (!categoryId) {
            throw new Error('Category ID is required');
        }

        const response = await api.delete(`${API_BASE_URL}/categories/${categoryId}`);
        
        return response.data;
    } catch (error) {
        console.error('Failed to delete category:', error);
        throw error;
    }
};

export default deleteCategory;