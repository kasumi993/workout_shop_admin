import MainLayout from "@/layouts/MainLayout";
import { useEffect, useState } from "react";
import CategoriesService from "@/services/categoriesService";
import CategoriesList from "@/components/Categories/CategoriesList";
import EditCategory from "@/components/Categories/EditCategory";

export default function Categories() {
  const [editedCategory, setEditedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await CategoriesService.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

  function onEditCategories() {
    fetchCategories();
    setRefresh(prev => prev + 1);
    setEditedCategory(null);
  }

  function editCategory(category) {
    setEditedCategory(category);
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Categories</h1>
        </div>

        {/* Category Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editedCategory
              ? `Edit category "${editedCategory.name}"`
              : 'Create new category'}
          </h2>
          <EditCategory 
            categories={categories} 
            editedCategory={editedCategory} 
            setEditedCategory={setEditedCategory}
            onEditCategories={onEditCategories}  
          />
        </div>

        {/* Categories List */}
        {!editedCategory && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Categories List</h2>
            </div>
            <CategoriesList
              onEditCategory={editCategory}
              refresh={refresh}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}