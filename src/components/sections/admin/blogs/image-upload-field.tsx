import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X, Image as ImageIcon } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface ImageUploadFieldProps {
  control: Control<any>;
  blogImg?: string;
  previewUrl?: string | null;
  onImageChange: (file: File) => void;
  onRemoveImage: () => void;
}

const ImageUploadField = ({
  control,
  blogImg,
  previewUrl,
  onImageChange,
  onRemoveImage,
}: ImageUploadFieldProps) => {
  return (
    <FormField
      control={control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel>تصویر کاور</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {blogImg && !previewUrl && (
                <div className="relative">
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl lg:h-64">
                    <Image
                      src={blogImg}
                      alt="Blog cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={80}
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                  <p className="text-accent-foreground mt-2 text-sm">
                    تصویر فعلی بلاگ
                  </p>
                </div>
              )}

              {previewUrl && (
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
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={() => {
                        onRemoveImage();
                        field.onChange(undefined);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-accent-foreground mt-2 text-sm">
                    تصویر جدید انتخاب شده
                  </p>
                </div>
              )}

              <Input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onImageChange(file);
                    field.onChange(file);
                  }
                }}
              />

              {field.value && (
                <div className="bg-muted rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {(field.value as File).name}
                    </span>
                  </div>
                  <p className="text-accent-foreground mt-1 text-xs">
                    حجم: {((field.value as File).size / 1024 / 1024).toFixed(2)}{" "}
                    MB
                  </p>
                </div>
              )}

              {blogImg && !field.value && (
                <p className="text-accent-foreground text-sm">
                  تصویر فعلی حفظ خواهد شد
                </p>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageUploadField;
