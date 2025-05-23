import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";
import { Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ImageUploaderProps {
  images: string[];
  onUpload: (imagePath: string) => void;
  onRemove: (index: number) => void;
  maxImages: number;
}

export function ImageUploader({ images, onUpload, onRemove, maxImages }: ImageUploaderProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (images.length >= maxImages) {
      toast({
        title: t("common.error"),
        description: t("services.max_images_reached", { count: maxImages }),
        variant: "destructive",
      });
      return;
    }
    
    const file = files[0];
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t("common.error"),
        description: t("services.file_too_large"),
        variant: "destructive",
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: t("common.error"),
        description: t("services.file_type_not_supported"),
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      // Upload image to server
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          // No Content-Type header as it's set automatically for FormData
          "x-user-id": localStorage.getItem("user") 
            ? JSON.parse(localStorage.getItem("user")!).id 
            : "",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      onUpload(data.path);
      
      // Clear input value to allow uploading the same file again
      e.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: t("common.error"),
        description: t("services.upload_failed"),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {/* Existing images */}
      {images.map((image, index) => (
        <div key={index} className="aspect-square relative">
          <img 
            src={image} 
            alt={`Uploaded image ${index + 1}`} 
            className="w-full h-full object-cover rounded-md border border-border"
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
            aria-label={t("common.remove")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      
      {/* Upload button placeholder (if under the limit) */}
      {images.length < maxImages && (
        <div className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center">
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <Camera className="h-6 w-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">
              {isUploading ? t("common.uploading") : t("common.add")}
            </span>
          </label>
        </div>
      )}
      
      {/* Empty placeholders to maintain grid */}
      {Array.from({ length: Math.max(0, maxImages - images.length - 1) }).map((_, index) => (
        <div 
          key={`empty-${index}`} 
          className="aspect-square border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center"
        >
          <span className="text-xs text-gray-300">{t("common.empty")}</span>
        </div>
      ))}
    </div>
  );
}
