import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import CategoryItem from "./CategoryItem";
import { useToast } from "@/components/GlobalComponents/Notifications";
import CategoriesService from "@/services/categoriesService";
import LoadingSpinner from "../GlobalComponents/LoadingSpinner";

export default function CategoriesList({ onEditCategory, onDeleteCategory, refresh }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
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
                await CategoriesService.deleteCategory(category.id);
                toast.success('Success', 'Category deleted successfully');
                fetchCategories();
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
            <div className="flex justify-center items-center p-8">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <>
            {/* Desktop table view */}
            <div className="hidden sm:block">
                <table className="basic w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Parent category
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
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
                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                    No categories found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile card view */}
            <div className="block sm:hidden p-4 space-y-3">
                {categories.length > 0 ? (
                    categories.map(category => (
                        <div key={category.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category name</span>
                                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                                </div>
                                {category?.parent?.name && (
                                    <div>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Parent category</span>
                                        <p className="text-sm text-gray-700">{category.parent.name}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-gray-200">
                                <button
                                    onClick={() => editCategory(category)}
                                    className="btn-default flex-1"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteCategory(category)}
                                    className="btn-red flex-1"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <div className="text-gray-500">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <p>No categories found</p>
                            <p className="text-sm mt-1">Get started by creating your first category</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}