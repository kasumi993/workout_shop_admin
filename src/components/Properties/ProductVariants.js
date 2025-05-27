import { useState, useEffect, useCallback } from 'react';
import { HiPlus } from 'react-icons/hi2';
import PropertyCard from './PropertyCard';

export default function ProductVariants({ 
//   categories, 
  categoryId, 
  initialProperties = {},
  onPropertiesChange,
  disabled = false 
}) {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
//   const [initialCategoryId, setInitialCategoryId] = useState(null);
//   const [hasUserSelectedCategory, setHasUserSelectedCategory] = useState(false);

//   // Get suggested properties from category hierarchy
//   const getSuggestedProperties = useCallback(() => {
//     if (!categories.length || !categoryId) return [];
    
//     const suggestions = [];
//     let currentCat = categories.find(cat => cat.id === categoryId);
    
//     while (currentCat) {
//       if (currentCat.properties?.length) {
//         suggestions.unshift(...currentCat.properties);
//       }
//       const parentId = currentCat.parent?.id || currentCat.parent;
//       currentCat = parentId ? categories.find(cat => cat.id === parentId) : null;
//     }
    
//     return suggestions.filter((prop, index, arr) => 
//       arr.findIndex(p => p.name === prop.name) === index
//     );
//   }, [categories, categoryId]);

//   // Store the initial category ID to detect user changes
//   useEffect(() => {
//     if (!isInitialized && categoryId) {
//       setInitialCategoryId(categoryId);
//     }
//   }, [categoryId, isInitialized]);

  // Initialize properties ONLY from existing data (not category suggestions)
  useEffect(() => {
    if (isInitialized) return;
    
    // Only initialize from existing properties, don't add category suggestions
    const existingProps = Object.keys(initialProperties || {}).map(key => ({
      id: Math.random().toString(36).substr(2, 9),
      name: key,
      values: Array.isArray(initialProperties[key]) ? initialProperties[key] : [initialProperties[key]].filter(Boolean),
      isFromCategory: false, // We'll update this flag only when user actively selects category
      isRequired: false
    }));

    setProperties(existingProps);
    setIsInitialized(true);
  }, [initialProperties, isInitialized]);

//   // Detect when user actively changes category (not initial load)
//   useEffect(() => {
//     if (!isInitialized) return;
    
//     // If category changed from the initial one, mark as user-selected
//     if (categoryId !== initialCategoryId) {
//       setHasUserSelectedCategory(true);
//     }
//   }, [categoryId, initialCategoryId, isInitialized]);

//   // Add category suggestions ONLY when user actively selects a category
//   useEffect(() => {
//     if (!isInitialized || !categoryId || !hasUserSelectedCategory) return;

//     // If no category is selected or categories changed, remove all category-suggested properties before affecting new suggestions
//     setProperties(prevProperties => 
//         prevProperties.map(prop => ({
//           ...prop,
//           isFromCategory: false // Remove the category flag
//         })).filter(prop => !prop.isFromCategory)
//       );
    
//     // const suggestions = getSuggestedProperties();
    
//     setProperties(prevProperties => {
//       // Update isFromCategory flag for existing properties based on current category
//       const updatedProperties = prevProperties.map(prop => ({
//         ...prop,
//         isFromCategory: suggestions.some(s => s.name === prop.name)
//       }));
      
//       // Add new suggestions that don't already exist
//       const existingNames = new Set(updatedProperties.map(p => p.name));
//       const newSuggestions = suggestions
//         .filter(suggestion => !existingNames.has(suggestion.name))
//         .map(suggestion => ({
//           id: Math.random().toString(36).substr(2, 9),
//           name: suggestion.name,
//           values: Array.isArray(suggestion.values) ? suggestion.values : suggestion.values?.split(',').map(v => v.trim()) || [],
//           isFromCategory: true,
//           isRequired: false
//         }));
      
//       return [...updatedProperties, ...newSuggestions];
//     });
//   }, [categoryId, getSuggestedProperties, isInitialized, hasUserSelectedCategory]);


  // Notify parent component of changes (with debouncing to prevent excessive calls)
  useEffect(() => {
    if (!isInitialized) return;
    
    const timeoutId = setTimeout(() => {
      const propertyObject = {};
      properties.forEach(prop => {
        if (prop.values.length > 0) {
          propertyObject[prop.name] = prop.values;
        }
      });
      onPropertiesChange?.(propertyObject);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [properties, onPropertiesChange, isInitialized]);

  const addNewProperty = () => {
    const newProperty = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      values: [],
      isFromCategory: false,
      isRequired: false
    };
    setProperties(prev => [...prev, newProperty]);
    setEditingProperty(newProperty.id);
    setEditingValue('');
  };

  const removeProperty = (propertyId) => {
    setProperties(prev => prev.filter(prop => prop.id !== propertyId));
  };

  const updatePropertyName = (propertyId, newName) => {
    setProperties(prev => prev.map(prop => 
      prop.id === propertyId ? { ...prop, name: newName } : prop
    ));
  };

  const addValue = (propertyId, value) => {
    if (!value.trim()) return;
    
    setProperties(prev => prev.map(prop => 
      prop.id === propertyId 
        ? { ...prop, values: [...prop.values, value.trim()] }
        : prop
    ));
  };

  const removeValue = (propertyId, valueIndex) => {
    setProperties(prev => prev.map(prop => 
      prop.id === propertyId 
        ? { ...prop, values: prop.values.filter((_, index) => index !== valueIndex) }
        : prop
    ));
  };

  const startEditing = (propertyId, currentName) => {
    setEditingProperty(propertyId);
    setEditingValue(currentName);
  };

  const saveEdit = (propertyId) => {
    if (editingValue.trim()) {
      updatePropertyName(propertyId, editingValue.trim());
    }
    setEditingProperty(null);
    setEditingValue('');
  };

  const cancelEdit = () => {
    setEditingProperty(null);
    setEditingValue('');
  };

  if (!categoryId && properties.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
          <button
            type="button"
            onClick={addNewProperty}
            disabled={disabled}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <HiPlus className="w-4 h-4 mr-2" />
            Add Variant
          </button>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>Select a category to see suggested variants, or add your own.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
        <button
          type="button"
          onClick={addNewProperty}
          disabled={disabled}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <HiPlus className="w-4 h-4 mr-2" />
          Add Variant
        </button>
      </div>

      <div className="space-y-4">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            editingProperty={editingProperty}
            editingValue={editingValue}
            setEditingValue={setEditingValue}
            onStartEditing={startEditing}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
            onAddValue={addValue}
            onRemoveValue={removeValue}
            onRemoveProperty={removeProperty}
            disabled={disabled}
          />
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No variants added yet. Click &quot;Add Variant&quot; to get started.</p>
        </div>
      )}
    </div>
  );
}