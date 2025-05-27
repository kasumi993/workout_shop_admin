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
        <form onSubmit={saveCategory}>
            <div className="flex gap-1">
                <input
                    type="text"
                    placeholder={'Category name'}
                    onChange={ev => setName(ev.target.value)}
                    value={name}
                    required
                    disabled={loading}
                />
                <select
                    onChange={ev => setParentCategory(ev.target.value)}
                    value={parentCategory}
                    disabled={loading}
                >
                    <option value="">No parent category</option>
                    {categories.length > 0 && categories
                        .filter(cat => cat.id !== editedCategory?.id) // Don't allow self as parent
                        .map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))
                    }
                </select>
            </div>
            <div className="mb-2">
                <label className="block">Properties</label>
                <button
                    onClick={addProperty}
                    type="button"
                    className="btn-default text-sm mb-2"
                    disabled={loading}
                >
                    Add new property
                </button>
                {properties.length > 0 && properties.map((property, index) => (
                    <div key={index} className="flex gap-1 mb-2">
                        <input 
                            type="text"
                            value={property.name}
                            className="mb-0"
                            onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                            placeholder="property name (example: color)"
                            disabled={loading}
                        />
                        <input 
                            type="text"
                            className="mb-0"
                            onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)}
                            value={property.values}
                            placeholder="values, comma separated"
                            disabled={loading}
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
                ))}
            </div>
            <div className="flex gap-1">
                {editedCategory && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="btn-default"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                )}
                <button 
                    type="submit"
                    className="btn-primary py-1"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
}