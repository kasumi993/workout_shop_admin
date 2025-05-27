
import { useState } from "react";
import { HiCheck, HiPencil, HiPlus, HiTrash, HiXCircle } from "react-icons/hi2";

export default function PropertyCard({
  property,
  editingProperty,
  editingValue,
  setEditingValue,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onAddValue,
  onRemoveValue,
  onRemoveProperty,
  disabled
}) {
  const [newValue, setNewValue] = useState('');
  const isEditing = editingProperty === property.id;

  const handleAddValue = (e) => {
    e.preventDefault();
    if (newValue.trim()) {
      onAddValue(property.id, newValue);
      setNewValue('');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Property Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onKeyDown={handleAddValue}
                className="text-sm font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Property name"
                autoFocus
                disabled={disabled}
              />
              <button
                type="button"
                onClick={() => onSaveEdit(property.id)}
                disabled={disabled}
                className="p-1 text-green-600 hover:text-green-700 transition-colors"
              >
                <HiCheck className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onCancelEdit}
                disabled={disabled}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HiXCircle className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <h4 className="text-sm font-medium text-gray-900 capitalize">
                {property.name || 'Unnamed Property'}
              </h4>
              {property.isFromCategory && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Suggested
                </span>
              )}
              <button
                type="button"
                onClick={() => onStartEditing(property.id, property.name)}
                disabled={disabled}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HiPencil className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
        
        <button
          type="button"
          onClick={() => onRemoveProperty(property.id)}
          disabled={disabled}
          className="p-1 text-red-400 hover:text-red-600 transition-colors"
        >
          <HiTrash className="w-4 h-4" />
        </button>
      </div>

      {/* Property Values */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {property.values.map((value, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 group hover:bg-gray-200 transition-colors duration-150"
            >
              {value}
              <button
                type="button"
                onClick={() => onRemoveValue(property.id, index)}
                disabled={disabled}
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <HiXCircle className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add New Value */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddValue(e)}
            placeholder={`Add ${property.name ? property.name.toLowerCase() : 'value'}...`}
            className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={disabled}
          />
          <button
            type="button"
            onClick={handleAddValue}
            disabled={!newValue.trim() || disabled}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <HiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}