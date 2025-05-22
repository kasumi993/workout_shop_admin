import deleteCategory from './delete';
import { getCategories, getCategoryById } from './get';
import createCategory from './post';

const services = {
    getCategories,
    getCategoryById,
    deleteCategory,
    createCategory,
}

export default services;