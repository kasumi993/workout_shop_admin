import deleteCategory from './delete';
import { getCategories, getCategoryById } from './get';
import createCategory from './create';
import updateCategory from './update';

const services = {
    getCategories,
    getCategoryById,
    deleteCategory,
    createCategory,
    updateCategory,
}

export default services;