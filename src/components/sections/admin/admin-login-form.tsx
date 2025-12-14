"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "../../ui/card";
import { loginSchema } from "@/lib/validation-schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const AdminLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const res = await signIn("admin", {
      username: values.username,
      password: values.password,
      callbackUrl: "/admin",
      redirect: false,
    });
    if (res?.status === 401) {
      toast.error("نام کاربری یا رمز عبور اشتباه است.", {
        description: "لطفا دوباره امتحان کنید.",
        action: {
          label: "متوجه شدم",
          onClick: () => console.log("Undo"),
        },
      });
    } else if (res?.status === 200) {
      toast.success("خوش آمدید.");
      router.push("/admin");
    } else if (res?.status !== 200) {
      toast.error("خطایی در سرور رخ داده.", {
        description: "لطفا دوباره امتحان کنید.",
        action: {
          label: "متوجه شدم",
          onClick: () => console.log("Undo"),
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام کاربری</FormLabel>
                <FormControl>
                  <Input placeholder="ادمین" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>رمز عبور</FormLabel>
                <FormControl>
                  <Input type={showPassword ? "text" : "password"} {...field} />
                </FormControl>
                <FormMessage />
                <div className="absolute top-1/2 left-0 -translate-y-1/6">
                  <button
                    type="button"
                    className="rounded-md p-2"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            ورود
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};

export default AdminLoginForm;
