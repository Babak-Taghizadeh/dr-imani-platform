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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const res = await signIn("credentials", {
      ...values,
      callbackUrl: "/admin",
      redirect: false,
    });
    console.log(res);
    if (res?.status === 401) {
      toast("نام کاربری یا رمز عبور اشتباه است.", {
        description: "لطفا دوباره امتحان کنید.",
        action: {
          label: "متوجه شدم",
          onClick: () => console.log("Undo"),
        },
      });
    } else if (res?.status === 200) {
      toast("خوش آمدید.");
      router.push("/admin");
    } else if (res?.status !== 200) {
      toast("خطایی در سرور رخ داده.", {
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
              <FormItem>
                <FormLabel>رمز عبور</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "ورود"
            )}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};

export default LoginForm;
