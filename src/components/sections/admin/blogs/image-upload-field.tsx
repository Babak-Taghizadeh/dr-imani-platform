import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadFieldProps {
  blogImg?: string;
  previewUrl?: string | null;
  onImageChange: (file: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  isUploading: boolean;
}

const ImageUploadField = ({
  blogImg,
  previewUrl,
  onImageChange,
  onRemoveImage,
  isUploading,
}: ImageUploadFieldProps) => {
  return (
    <div className="space-y-4">
      <Label>Featured Image</Label>
      {previewUrl ? (
        <div className="relative">
          <div className="relative h-48 w-full overflow-hidden rounded-2xl lg:h-64">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={80}
              loading="lazy"
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={onRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Label
                htmlFor="image-upload"
                className="inline-flex cursor-pointer items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    در حال آپلود ...
                  </>
                ) : (
                  "انتخاب تصویر"
                )}
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageChange}
                disabled={isUploading}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              فرمت‌های مجاز: PNG, JPG, GIF (حداکثر 5MB)
            </p>
          </div>
        </div>
      )}
      {blogImg && !previewUrl && (
        <div className="relative">
          <div className="relative h-48 w-full overflow-hidden rounded-2xl lg:h-64">
            <Image
              src={`/api/upload/${blogImg}`}
              alt="Blog cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={80}
              loading="lazy"
              className="object-cover"
            />
          </div>
          <p className="text-accent-foreground mt-2 text-sm">تصویر فعلی بلاگ</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
