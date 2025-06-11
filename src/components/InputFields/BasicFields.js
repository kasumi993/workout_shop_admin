export default function BasicFields({ 
  title, 
  setTitle, 
  description, 
  setDescription, 
  price, 
  setPrice, 
  disabled 
}) {
  return (
    <>
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product name *
        </label>
        <input
          type="text"
          placeholder="Enter product name"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          required
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          placeholder="Enter product description"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          disabled={disabled}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price (Fr Cfa) *
        </label>
        <input
          type="number" 
          placeholder="0.00"
          value={price}
          onChange={(ev) => setPrice(ev.target.value)}
          step="0.01"
          min="0"
          required
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
    </>
  );
}