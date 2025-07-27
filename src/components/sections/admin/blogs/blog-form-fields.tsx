import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import RichTextEditor from "../text-editor";
import { Control } from "react-hook-form";

interface BlogFormFieldsProps {
  control: Control<any>;
}

export const BlogFormFields = ({ control }: BlogFormFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>عنوان</FormLabel>
            <FormControl>
              <Input placeholder="عنوان بلاگ را وارد کنید" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>محتوا</FormLabel>
            <FormControl>
              <RichTextEditor content={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>وضعیت انتشار</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="وضعیت بلاگ را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="منتشر شده">منتشر شده</SelectItem>
                  <SelectItem value="ذخیره شده">ذخیره شده</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
