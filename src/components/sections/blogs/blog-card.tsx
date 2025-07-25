import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Blog } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <Card className="bg-secondary text-foreground py-4">
      <CardHeader className="px-4">
        <div className="relative h-64 w-full">
          <Image
            src={blog.img}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={80}
            loading="lazy"
            className="rounded-md object-cover transition-all duration-300 hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="-mt-4">
        <CardTitle className="mb-2 lg:text-lg">{blog.title}</CardTitle>
        <CardDescription>{blog.excerpt}</CardDescription>
      </CardContent>
      <CardFooter className="mt-auto mr-auto">
        <Link
          className="text-primary flex items-center gap-1 hover:underline"
          href={`/blogs/${blog.id}`}
        >
          ادامه مطلب
          <ArrowLeft size={15} />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
