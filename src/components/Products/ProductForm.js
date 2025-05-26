import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/GlobalComponents/BouncingSpinner";
import { ReactSortable } from "react-sortablejs";
import { useToast } from "@/components/GlobalComponents/Notifications";
import CategoriesService from "@/services/categoriesService";
import ProductsService from "@/services/productsService";
import FilesService from "@/services/filesService";
import SelectTwoLists from "@/components/DesignSystem/SelectTwoLists";

export default function ProductForm({
  id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  categoryId: assignedCategoryId,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [categoryId, setCategoryId] = useState(assignedCategoryId || '');
  const [productProperties, setProductProperties] = useState(assignedProperties || {});
  const [price, setPrice] = useState(existingPrice || '');
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await CategoriesService.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Error', 'Failed to load categories');
    }
  }

  async function saveProduct(ev) {
    ev.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        title,
        description,
        price: parseFloat(price),
        images,
        categoryId: categoryId || null,
        properties: productProperties
      };
      
      if (id) {
        // Update existing product
        await ProductsService.updateProduct(id, data);
        toast.success('Success', 'Product updated successfully');
      } else {
        // Create new product
        await ProductsService.createProduct(data);
        toast.success('Success', 'Product created successfully');
      }
      
      setGoToProducts(true);
    } catch (error) {
      console.error('Failed to save product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save product';
      toast.error('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (goToProducts) {
    router.push('/products');
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);      
      try {
        const res = await FilesService.uploadFile(files);
        
        setImages(oldImages => {
          return [...oldImages, ...res.links];
        });
        
        toast.success('Success', 'Images uploaded successfully');
      } catch (error) {
        console.error('Failed to upload images:', error);
        toast.error('Error', 'Failed to upload images');
      } finally {
        setIsUploading(false);
      }
    }
  }

  async function deleteImage(link) {
    try {
      await FilesService.deleteFile(id, link);  
      setImages(prevImages => prevImages.filter(imgLink => imgLink !== link));
      toast.success('Success', 'Image deleted successfully');
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error('Error', 'Failed to delete image');
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }
  
  function setProductProp(propName, value) {
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && categoryId) {
    let catInfo = categories.find(({id}) => id === categoryId);
    if (catInfo) {
      propertiesToFill.push(...(catInfo.properties || []));
      while(catInfo?.parent?.id || catInfo?.parent) {
        const parentId = catInfo.parent?.id || catInfo.parent;
        const parentCat = categories.find(({id}) => id === parentId);
        if (parentCat) {
          propertiesToFill.push(...(parentCat.properties || []));
          catInfo = parentCat;
        } else {
          break;
        }
      }
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <div>
        <label>Product name</label>
        <input
          type="text"
          placeholder="Product name"
          value={title}
          onChange={ev => setTitle(ev.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={ev => setDescription(ev.target.value)}
          disabled={loading}
        />
      </div>
      
      <div>
        <label>Photos</label>
        <div className="mb-2 flex flex-wrap gap-1">
          <ReactSortable
            list={images}
            className="flex flex-wrap gap-1"
            setList={updateImagesOrder}
          >
            {!!images?.length && images.map(link => (
              <div key={link} className="relative h-40 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                <img src={link} alt="" className="rounded-lg h-full w-full object-cover"/>
                <button
                  type="button"
                  onClick={() => deleteImage(link)}
                  className="absolute top-1 right-1 bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-400 cursor-pointer"
                  disabled={loading}
                >
                  &times;
                </button>
              </div>
            ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-40 flex items-center">
              <Spinner />
            </div>
          )}
          <label className="w-40 h-40 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-[#5542F6] rounded-sm bg-white shadow-sm border border-[#5542F6]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div>Add image</div>
            <input 
              type="file" 
              onChange={uploadImages} 
              className="hidden" 
              multiple
              accept="image/*"
              disabled={loading || isUploading}
            />
          </label>
        </div>
      </div>
      
      <div className="mb-4 mt-6">
        <SelectTwoLists list={categories} onElementSelected={(value) => setCategoryId(value)} initialElementId={categoryId} label={"Category"}/>
      </div>

      <div>
        {propertiesToFill.length > 0 && propertiesToFill.map(p => (
          <div key={p.name} className="">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select 
                value={productProperties[p.name] || ''}
                onChange={ev => setProductProp(p.name, ev.target.value)}
                disabled={loading}
              >
                <option value="">Choose {p.name}</option>
                {p.values.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <label>Price (in USD)</label>
      <input
        type="number" 
        placeholder="price"
        value={price}
        onChange={ev => setPrice(ev.target.value)}
        step="0.01"
        min="0"
        required
        disabled={loading}
      />
      
      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}