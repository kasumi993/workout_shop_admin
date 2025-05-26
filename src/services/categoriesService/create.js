import api from '@/lib/api';

/**
 * Creates a new category
 */
const createCategory = async (categoryData) => {
    try {
        const response = await api.post('/categories', categoryData);
        
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export default createCategory;