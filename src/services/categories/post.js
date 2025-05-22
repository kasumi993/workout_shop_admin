import api from '/lib/api';
import { API_URL } from '../../config';

/**
 * Creates a new category
 */
const createCategory = async (categoryData) => {
    try {
        const response = await api.post(
            `${API_URL}/categories`, categoryData,
        );
        
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export default createCategory;