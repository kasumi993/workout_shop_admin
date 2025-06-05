import api from '@/lib/api';


export const deleteCustomer = async (customerId) => {
    try {
        if (!customerId) {
            throw new Error('Customer ID is required');
        }

        const response = await api.delete(`/customers/${customerId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to delete customer:', error);
        throw error;
    }
};