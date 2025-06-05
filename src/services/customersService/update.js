import api from '@/lib/api';


/**
 * Updates a customer
 */
export const updateCustomer = async (id, customerData) => {
    try {
        const response = await api.patch(`/customers/${id}`, customerData);
        return response.data;
    } catch (error) {
        console.error('Error updating customer:', error);
        throw error;
    }
};
