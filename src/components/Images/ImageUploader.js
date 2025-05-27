import { useState, useCallback } from "react";
import { ReactSortable } from "react-sortablejs";
import Spinner from "@/components/GlobalComponents/BouncingSpinner";
import FilesService from "@/services/filesService";
import { useToast } from "@/components/GlobalComponents/Notifications";

export default function ImageUploader({ images, setImages, disabled }) {
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const uploadImages = useCallback(async (ev) => {
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
    
    if (!validFiles.length) return;
    
    setIsUploading(true);
    
    try {
      const res = await FilesService.uploadFile(validFiles);
      setImages(prevImages => [...prevImages, ...res.links]);
      toast.success('Success', `${validFiles.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Failed to upload images:', error);
      toast.error('Error', 'Failed to upload images');
    } finally {
      setIsUploading(false);
      ev.target.value = '';
    }
  }, [toast, setImages]);

  const deleteImage = useCallback(async (link) => {
    try {
      await FilesService.deleteFile(link);  
      setImages(prevImages => prevImages.filter(imgLink => imgLink !== link));
      toast.success('Success', 'Image deleted successfully');
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error('Error', 'Failed to delete image');
    }
  }, [toast, setImages]);

  const updateImagesOrder = useCallback((newList) => {
    setImages(newList.map(item => item.content));
  }, [setImages]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Photos
      </label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images.map(link => ({ id: link, content: link }))}
          setList={updateImagesOrder}
          className="flex flex-wrap gap-1"
          disabled={disabled}
        >
        {images?.length && images.map(link => (
            <div key={link} className="relative h-40 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
            <img src={link} alt="" className="rounded-lg h-full w-full object-cover" loading="lazy"/>
            <button
                type="button"
                onClick={() => deleteImage(link)}
                className="absolute top-1 right-1 bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-400 cursor-pointer"
                disabled={disabled}
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
              disabled={disabled || isUploading}
            />
          </label>
      </div>
      {images.length > 0 && (
        <p className="text-sm text-gray-500 mt-2">
          Drag images to reorder them
        </p>
      )}
    </div>
  );
}