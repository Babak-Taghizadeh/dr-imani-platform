import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ImageUploadFieldProps {
  blogImg?: string;
  previewUrl?: string | null;
  selectedImage: File | null;
  onImageChange: (file: File) => void;
  onRemoveImage: () => void;
  isEditing: boolean;
}

const ImageUploadField = ({
  blogImg,
  previewUrl,
  selectedImage,
  onImageChange,
  onRemoveImage,
  isEditing,
}: ImageUploadFieldProps) => {
  return (
    <FormItem>
      <FormLabel>عکس کاور</FormLabel>
      <FormControl>
        <div className="space-y-4">
          {blogImg && !previewUrl && (
            <div className="relative">
              <div className="relative h-48 w-full overflow-hidden rounded-md border">
                <Image
                  src={blogImg}
                  alt="Blog cover"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                تصویر فعلی بلاگ
              </p>
            </div>
          )}

          {previewUrl && (
            <div className="relative">
              <div className="relative h-48 w-full overflow-hidden rounded-md border">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={onRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                تصویر جدید انتخاب شده
              </p>
            </div>
          )}

          <div className="flex items-center gap-4">
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageChange(file);
              }}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="bg-muted border-input hover:bg-accent inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
            >
              <Upload className="h-4 w-4" />
              {isEditing ? "تغییر تصویر" : "انتخاب تصویر"}
            </label>

            {isEditing && !selectedImage && (
              <span className="text-muted-foreground text-sm">
                تصویر فعلی حفظ خواهد شد
              </span>
            )}
          </div>

          {selectedImage && (
            <div className="bg-muted rounded-md p-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {selectedImage.name}
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                حجم: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default ImageUploadField;
