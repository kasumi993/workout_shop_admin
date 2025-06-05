
import { getCustomers, getCustomerById } from './get';
import { createCustomer } from './create';
import { updateCustomer } from './update';
import { deleteCustomer } from './delete';

const services = {
    getCustomers,
    getCustomerById,
    deleteCustomer,
    createCustomer,
    updateCustomer,
}

export default services;