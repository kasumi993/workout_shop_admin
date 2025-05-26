export default function CategoryItem({ category, onEditCategory, onDeleteCategory }) {

    function editCategory(category) {
        onEditCategory(category);
    }
    function deleteCategory(category) {
        onDeleteCategory(category);
    }
    return (
        <tr key={category.id}>
            <td>{category.name}</td>
            <td>{category?.parent?.name}</td>
            <td>
              <button
                onClick={() => editCategory(category)}
                className="btn-default mr-1"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCategory(category)}
                className="btn-red">Delete</button>
            </td>
          </tr>
    )
}