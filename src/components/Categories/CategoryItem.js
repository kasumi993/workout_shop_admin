export default function CategoryItem({ category, onEditCategory, onDeleteCategory }) {

    function editCategory(category) {
        onEditCategory(category);
    }
    function deleteCategory(category) {
        onDeleteCategory(category);
    }
    return (
      <tr key={category.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{category.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">{category?.parent?.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => editCategory(category)}
                        className="btn-default"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => deleteCategory(category)}
                        className="btn-red"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    )
}