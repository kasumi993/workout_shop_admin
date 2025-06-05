import { useState, useCallback } from "react";
import Spinner from "@/components/GlobalComponents/LoadingSpinner";
import SelectTwoLists from "@/components/DesignSystem/SelectTwoLists";
import ImageUploader from "@/components/Images/ImageUploader";
import BasicFields from "@/components/InputFields/BasicFields";
import ProductVariants from "@/components/Properties/ProductVariants";
import { useCategories } from "@/hooks/useCategories";
import { useProductForm } from "@/hooks/useProductForm";

export default function ProductForm({
  id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  categoryId: assignedCategoryId,
  properties: assignedProperties,
}) {
  // Form state
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [categoryId, setCategoryId] = useState(assignedCategoryId || '');
  const [productProperties, setProductProperties] = useState(assignedProperties || {});
  const [price, setPrice] = useState(existingPrice || '');
  const [images, setImages] = useState(existingImages || []);

  // Custom hooks
  const { categories, loading: categoriesLoading } = useCategories();
  const { saveProduct, loading: saving } = useProductForm(id);

  const handleSubmit = useCallback(async (ev) => {
    ev.preventDefault();
    
    await saveProduct({
      title,
      description,
      price,
      images,
      categoryId,
      properties: productProperties
    });
  }, [saveProduct, title, description, price, images, categoryId, productProperties]);

  const handleCategoryChange = useCallback((value) => {
    setCategoryId(value);
  }, []);

  const handlePropertiesChange = useCallback((properties) => {
    setProductProperties(properties);
  }, []);

  // Show loading spinner while categories are loading
  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  const isDisabled = saving;

  return (
    <div className="max-w-5xl ">
      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
        {/* Basic Product Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 responsive-card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4 sm:space-y-6">
            <BasicFields
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              price={price}
              setPrice={setPrice}
              disabled={isDisabled}
            />
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 responsive-card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
          <ImageUploader
            images={images}
            setImages={setImages}
            disabled={isDisabled}
            productId={id}
          />
        </div>
        
        {/* Category Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 responsive-card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Category</h2>
          <SelectTwoLists 
            list={categories} 
            onElementSelected={handleCategoryChange} 
            initialElementId={categoryId} 
            label="Category"
          />
        </div>

        {/* Product Variants */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 responsive-card">
          <ProductVariants
            categories={categories}
            categoryId={categoryId}
            initialProperties={productProperties}
            onPropertiesChange={handlePropertiesChange}
            disabled={isDisabled}
          />
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end px-4 sm:px-0">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            disabled={isDisabled}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              id ? 'Update Product' : 'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}