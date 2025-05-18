import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import CategoryItem from "./CategoryItem";

export default function CategoriesList({ onEditCategory, onDeleteCategory }) {
    const [ categories, setCategories ] = useState([]);
    
    useEffect(() => {
        fetchCategories();
    }, []);
    
    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }

    function editCategory(category) {
        onEditCategory(category);
    }

    function deleteCategory(category) {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                const {_id} = category;
                await axios.delete('/api/categories/'+_id);
                // After deletion, refresh the categories
                fetchCategories();
            }
        });
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
                    {categories.length && categories.map(category => (
                        <CategoryItem
                            key={category._id}
                            category={category}
                            onEditCategory={editCategory}
                            onDeleteCategory={deleteCategory}
                        />
                    ))}
                </tbody>
            </table>
        </>
    );
}