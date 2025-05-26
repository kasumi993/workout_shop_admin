import deleteProduct from './delete';
import { getProducts, getProductById } from './get';
import createProduct from './create';
import updateProduct from './update';

const services = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
}

export default services;