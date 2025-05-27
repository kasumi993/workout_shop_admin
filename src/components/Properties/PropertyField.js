export default function PropertyField({ property, value, onChange, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {property.name.charAt(0).toUpperCase() + property.name.slice(1)}
      </label>
      <select 
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <option value="">Choose {property.name}</option>
        {property.values?.map(propertyValue => (
          <option key={propertyValue} value={propertyValue}>
            {propertyValue}
          </option>
        ))}
      </select>
    </div>
  );
}