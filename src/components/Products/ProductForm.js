import { useState, useCallback } from "react";
import Spinner from "@/components/GlobalComponents/BouncingSpinner";
import SelectTwoLists from "@/components/DesignSystem/SelectTwoLists";
import AddProperties from "@/components/Properties/AddProperties";
import ImageUploader from "@/components/Images/ImageUploader";
import BasicFields from "@/components/InputFields/BasicFields";
import CategoryProperties from "@/components/Properties/CategoryProperties";
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
    // Clear properties when category changes
    setProductProperties({});
  }, []);

  const setProductProp = useCallback((propName, value) => {
    setProductProperties(prev => ({
      ...prev,
      [propName]: value
    }));
  }, []);

  const addPropertiesToFill = useCallback((properties) => {
    if (typeof properties === 'object' && properties !== null) {
      // If it's an object, merge with existing properties
      setProductProperties(prev => ({
        ...prev,
        ...properties
      }));
    }
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        price={price}
        setPrice={setPrice}
        disabled={isDisabled}
      />

      <ImageUploader
        images={images}
        setImages={setImages}
        disabled={isDisabled}
        productId={id}
      />
      
      <div>
        <SelectTwoLists 
          list={categories} 
          onElementSelected={handleCategoryChange} 
          initialElementId={categoryId} 
          label="Category"
        />
      </div>

      <AddProperties onUpdateProperties={addPropertiesToFill} />

      <CategoryProperties
        categories={categories}
        categoryId={categoryId}
        productProperties={productProperties}
        setProductProp={setProductProp}
        disabled={isDisabled}
      />
      
      <button
        type="submit"
        className="btn-primary"
        disabled={isDisabled}
      >
        {saving ? 'Saving...' : id ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
}