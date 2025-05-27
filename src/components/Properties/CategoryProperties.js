import { useMemo } from "react";
import PropertiesList from "./PropertiesList";

export default function CategoryProperties({ 
  categories, 
  categoryId,
  setProductProp, 
  disabled 
}) {
  // Memoized computation of properties to fill
  const propertiesToFill = useMemo(() => {
    if (!categories.length || !categoryId) return [];
    
    const properties = [];
    let currentCat = categories.find(cat => cat.id === categoryId);
    
    // Collect properties from current category and all parent categories
    while (currentCat) {
      if (currentCat.properties?.length) {
        properties.unshift(...currentCat.properties);
      }
      
      const parentId = currentCat.parent?.id || currentCat.parent;
      currentCat = parentId ? categories.find(cat => cat.id === parentId) : null;
    }
    
    // Remove duplicates by property name
    const uniqueProperties = properties.filter((prop, index, arr) => 
      arr.findIndex(p => p.name === prop.name) === index
    );
    
    return uniqueProperties;
  }, [categories, categoryId]);

  if (!propertiesToFill.length) return null;

  return (
    <PropertiesList
      propertiesToFill={propertiesToFill}
      setProductProp={setProductProp}
      disabled={disabled}
    />
  );
}