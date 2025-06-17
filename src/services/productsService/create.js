import api from '@/lib/api';

/**
 * Creates a new product
 */
/**
 * Creates a new product
 */
export const createProduct = async (productData) => {
    try {
        const response = await api.post('/products', productData);
        
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};


