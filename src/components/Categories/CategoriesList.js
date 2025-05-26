import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import CategoryItem from "./CategoryItem";
import { useToast } from "@/components/GlobalComponents/Notifications";
import CategoriesService from "@/services/categoriesService";
import LoadingSpinner from "../GlobalComponents/LoadingSpinner";

export default function CategoriesList({ onEditCategory, onDeleteCategory, refresh }) {
    const [ categories, setCategories ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const toast = useToast();
    
    useEffect(() => {
        fetchCategories();
    }, [refresh]);
    
    async function fetchCategories() {
        try {
            setLoading(true);
            const response = await CategoriesService.getCategories();
            setCategories(response);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('Error', 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    }

    function editCategory(category) {
        onEditCategory(category);
    }

    async function deleteCategory(category) {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        });
        
        if (result.isConfirmed) {
            try {
                console.log('Deleting category:', category);
                await CategoriesService.deleteCategory(category.id);
                toast.success('Success', 'Category deleted successfully');
                // After deletion, refresh the categories
                fetchCategories();
                // call parent's callback
                if (onDeleteCategory) {
                    onDeleteCategory(category);
                }
            } catch (error) {
                console.error('Failed to delete category:', error);
                toast.error('Error', 'Failed to delete category');
            }
        }
    }

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category name</td>
                        <td>Parent category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 ? (
                        categories.map(category => (
                            <CategoryItem
                                key={category.id}
                                category={category}
                                onEditCategory={editCategory}
                                onDeleteCategory={deleteCategory}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center text-gray-500 py-4">
                                No categories found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}