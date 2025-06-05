import { useState, useCallback } from "react";
import { ReactSortable } from "react-sortablejs";
import Spinner from "@/components/GlobalComponents/BouncingSpinner";
import FilesService from "@/services/filesService";
import { useToast } from "@/components/GlobalComponents/Notifications";

export default function ImageUploader({ images, setImages, disabled }) {
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const uploadImages = useCallback(async (ev) => {
    ev.preventDefault();
    
    const files = ev.target?.files;
    if (!files?.length) return;
    
    // Validate file types and sizes
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error('Error', `${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Error', `${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });
    
    if (!validFiles.length) {
      ev.target.value = '';
      return;
    }
    
    setIsUploading(true);
    
    try {
      const res = await FilesService.uploadFile(validFiles);
      
      setImages(prevImages => {
        const newImages = [...prevImages, ...res.links];
        return newImages;
      });
      
      toast.success('Success', `${validFiles.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Failed to upload images:', error);
      toast.error('Error', 'Failed to upload images');
    } finally {
      setIsUploading(false);
      ev.target.value = '';
    }
  }, [toast, setImages]);

  const deleteImage = useCallback(async (ev, link) => {
    ev.preventDefault();
    ev.stopPropagation();
    
    if (disabled || isUploading) return;
    
    try {
      await FilesService.deleteFile(link);  
      
      setImages(prevImages => {
        const filteredImages = prevImages.filter(imgLink => imgLink !== link);
        return filteredImages;
      });
      
      toast.success('Success', 'Image deleted successfully');
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error('Error', 'Failed to delete image');
    }
  }, [toast, setImages, disabled, isUploading]);

  const updateImagesOrder = useCallback((newList) => {
    const newOrder = newList.map(item => item.content);
    setImages(prevImages => {
      if (JSON.stringify(prevImages) !== JSON.stringify(newOrder)) {
        return newOrder;
      }
      return prevImages;
    });
  }, [setImages]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Photos
      </label>
      
      {/* Image grid */}
      <div className="mb-2">
        <ReactSortable
          list={images.map(link => ({ id: link, content: link }))}
          setList={updateImagesOrder}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3"
          disabled={disabled || isUploading}
          animation={150}
          delayOnTouchStart={true}
          delay={2}
        >
          {images?.length && images.map(link => (
            <div key={link} className="relative aspect-square bg-white p-2 sm:p-3 shadow-sm rounded-sm border border-gray-200 group">
              <img 
                src={link} 
                alt="" 
                className="rounded-lg h-full w-full object-cover" 
                loading="lazy"
                draggable={false}
              />
              <button
                type="button"
                onClick={(ev) => deleteImage(ev, link)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 cursor-pointer transition-colors duration-200 opacity-0 group-hover:opacity-100 sm:opacity-100"
                disabled={disabled || isUploading}
                aria-label={`Delete image`}
              >
                &times;
              </button>
            </div>
          ))}
        </ReactSortable>
        
        {/* Upload button and loading spinner container */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mt-2">
          {isUploading && (
            <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-sm border border-gray-200">
              <Spinner />
            </div>
          )}

          <label className="aspect-square cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-[#5542F6] rounded-sm bg-white shadow-sm border border-[#5542F6] hover:bg-gray-50 transition-colors duration-200 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div className="text-xs sm:text-sm font-medium">Add image</div>
            <input 
              type="file" 
              onChange={uploadImages} 
              className="hidden" 
              multiple
              accept="image/*"
              disabled={disabled || isUploading}
            />
          </label>
        </div>
      </div>
      
      {images.length > 0 && (
        <p className="text-sm text-gray-500 mt-2">
          Drag images to reorder them
        </p>
      )}
    </div>
  );
}