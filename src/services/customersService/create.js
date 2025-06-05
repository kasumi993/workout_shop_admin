import api from '@/lib/api';

/**
 * Creates a new customer
 */
export const createCustomer = async (customerData) => {
    try {
        const response = await api.post('/customers', customerData);
        return response.data;
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
};