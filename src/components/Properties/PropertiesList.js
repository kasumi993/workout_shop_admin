import PropertyField from "./PropertyField";

export default function PropertiesList({ 
  propertiesToFill, 
  setProductProp, 
  disabled 
}) {

  if (!propertiesToFill.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Product Properties</h3>
      {propertiesToFill.map(property => (
        <PropertyField
          key={property.name}
          property={property}
          value={property.value || ''}
          onChange={(value) => setProductProp(property.name, value)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}