import api from '@/lib/api';


/**
 * Fetches all customers from the backend
 */
export const getCustomers = async () => {
    try {
        const response = await api.get('/customers');
        return response.data;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};

/**
 * Fetches a single customer by ID
 * 
 * @param {string|number} id - Customer ID
 * @returns {Promise<Object>} - Promise with the customer data
 */
export const getCustomerById = async (id) => {
    try {
        const response = await api.get(`/customers/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching customer with ID ${id}:`, error);
        throw error;
    }
};