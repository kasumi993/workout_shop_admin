import MainLayout from "@/layouts/MainLayout";
import {useEffect, useState} from "react";
import axios from "axios";
import CategoriesList from "@/components/Categories/CategoriesList";
import EditCategory from "@/components/Categories/EditCategory";

export default function Categories() {
  const [editedCategory, setEditedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }

  function onEditCategories() {
    fetchCategories();
    setEditedCategory(null);
  }


  function editCategory(category){
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
      <EditCategory categories={categories} editedCategory={editedCategory} onEditCategories={onEditCategories}  />
      {!editedCategory && (
        <CategoriesList
          onEditCategory={editCategory}
        />
      )}
    </MainLayout>
  );
}