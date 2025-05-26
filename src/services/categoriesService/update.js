import api from '@/lib/api';

/**
 * Updates a category
 */
const updateCategory = async (id, categoryData) => {
    try {
        const response = await api.patch(`/categories/${id}`, categoryData);
        
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

export default updateCategory;