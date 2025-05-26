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
    setRefresh(prev => prev + 1); // Trigger refresh in CategoriesList
    setEditedCategory(null);
  }

  function editCategory(category) {
    setEditedCategory(category);
  }

  return (
    <MainLayout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : 'Create new category'}
      </label>
      <EditCategory 
        categories={categories} 
        editedCategory={editedCategory} 
        setEditedCategory={setEditedCategory}
        onEditCategories={onEditCategories}  
      />
      {!editedCategory && (
        <CategoriesList
          onEditCategory={editCategory}
          refresh={refresh}
        />
      )}
    </MainLayout>
  );
}