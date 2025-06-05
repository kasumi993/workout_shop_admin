import { useState, useEffect } from 'react';
import { useToast } from '@/components/GlobalComponents/Notifications';
import CategoriesService from '@/services/categoriesService';

export default function EditCategory({ 
    categories,
    onEditCategories, 
    editedCategory,
    setEditedCategory,
}) {
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (editedCategory) {
            setName(editedCategory.name || '');
            setParentCategory(editedCategory.parent?.id || editedCategory.parent || '');
            setProperties(editedCategory.properties || []);
        } else {
            setName('');
            setParentCategory('');
            setProperties([]);
        }
    }, [editedCategory]);

    async function saveCategory(ev) {
        ev.preventDefault();
        setLoading(true);
        
        try {
            const data = {
                name,
                parentId: parentCategory || null,
                properties: properties.map(p => ({
                    name: p.name,
                    values: typeof p.values === 'string' ? p.values.split(',').map(v => v.trim()) : p.values,
                })),
            };
            
            if (editedCategory) {
                await CategoriesService.updateCategory(editedCategory.id, data);
                toast.success('Success', 'Category updated successfully');
            } else {
                await CategoriesService.createCategory(data);
                toast.success('Success', 'Category created successfully');
            }
            
            // Reset form
            setName('');
            setParentCategory('');
            setProperties([]);
            if (setEditedCategory) {
                setEditedCategory(null);
            }
            
            // Notify parent to refresh
            onEditCategories();
        } catch (error) {
            console.error('Failed to save category:', error);
            const errorMessage = error.response?.data?.message || 'Failed to save category';
            toast.error('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, {name:'', values:''}];
        });
    }
    
    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }
    
    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }
    
    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    function cancelEdit() {
        setName('');
        setParentCategory('');
        setProperties([]);
        if (setEditedCategory) {
            setEditedCategory(null);
        }
    }

    return (
        <form onSubmit={saveCategory} className="space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category name *
                    </label>
                    <input
                        type="text"
                        placeholder="Category name"
                        onChange={ev => setName(ev.target.value)}
                        value={name}
                        required
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent category
                    </label>
                    <select
                        onChange={ev => setParentCategory(ev.target.value)}
                        value={parentCategory}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                    >
                        <option value="">No parent category</option>
                        {categories.length > 0 && categories
                            .filter(cat => cat.id !== editedCategory?.id)
                            .map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
            </div>

            {/* Properties Section */}
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-0">
                        Properties
                    </label>
                    <button
                        onClick={addProperty}
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                        disabled={loading}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add new property
                    </button>
                </div>

                <div className="space-y-3">
                    {properties.length > 0 && properties.map((property, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                            <div>
                                <input 
                                    type="text"
                                    value={property.name}
                                    onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                    placeholder="Property name (example: color)"
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 text-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)}
                                    value={property.values}
                                    placeholder="Values, comma separated"
                                    disabled={loading}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 text-sm"
                                />
                                <button
                                    onClick={() => removeProperty(index)}
                                    type="button"
                                    className="btn-red"
                                    disabled={loading}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200">
                {editedCategory && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="cursor-pointer w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                )}
                <button 
                    type="submit"
                    className="cursor-pointer w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-400 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        editedCategory ? 'Update Category' : 'Create Category'
                    )}
                </button>
            </div>
        </form>
    );
}