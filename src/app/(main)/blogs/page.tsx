import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockBlogs } from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlogsPage = () => {
  return (
    <div className="bg-foreground grid grid-cols-1 gap-6 p-12 sm:grid-cols-2 lg:grid-cols-3">
      <h1 className="text-background col-span-full text-xl font-bold md:text-3xl">
        اخبار و وبلاگ
      </h1>
      {mockBlogs.map((item, index) => (
        <Card key={index} className="bg-background text-foreground">
          <CardHeader>
            <div className="relative h-48 w-full">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="rounded-md object-cover transition-all duration-300 hover:scale-105"
              />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <CardDescription>{item.content}</CardDescription>
          </CardContent>
          <CardFooter className="mt-auto">
            <Link
              className="text-primary flex items-center gap-1 hover:underline"
              href={`/blogs/1`}
            >
              ادامه مطلب
              <ArrowLeft size={15} />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BlogsPage;
