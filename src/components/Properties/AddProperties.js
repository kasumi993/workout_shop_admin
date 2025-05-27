import { useEffect, useState } from "react";

export default function AddProperties({onUpdateProperties}) {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        onUpdateProperties(properties);
    }, [properties, onUpdateProperties]);

    function addProperty() {
        setProperties(prev => {
            return [...prev, {name:'', values:''}];
        });
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }
    
    function handlePropertyNameChange(index, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }
    
    function handlePropertyValuesChange(index, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }

    return (
        <div className="mb-2">
                <label className="block">Properties</label>
                <button
                    onClick={addProperty}
                    type="button"
                    className="btn-default text-sm mb-2"
                >
                    Add new property
                </button>
                {properties.length > 0 && properties.map((property, index) => (
                    <div key={index} className="flex gap-1 mb-2">
                        <input 
                            type="text"
                            value={property.name}
                            className="mb-0"
                            onChange={ev => handlePropertyNameChange(index, ev.target.value)}
                            placeholder="property name (example: color)"
                        />
                        <input 
                            type="text"
                            className="mb-0"
                            onChange={ev => handlePropertyValuesChange(index, ev.target.value)}
                            value={property.values}
                            placeholder="values, comma separated"
                        />
                        <button
                            onClick={() => removeProperty(index)}
                            type="button"
                            className="btn-red"
                        >
                            Remove
                        </button>
                    </div>
                ))}
        </div>
    )
}