import api from '@/lib/api';

/**
 * Creates a new product
 */
const createProduct = async (productData) => {
    try {
        const response = await api.post('/products', productData);
        
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export default createProduct;