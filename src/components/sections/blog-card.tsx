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
    <Card className="bg-background text-foreground">
      <CardHeader>
        <div className="relative h-48 w-full">
          <Image
            src={blog.img}
            alt={blog.title}
            fill
            className="rounded-md object-cover transition-all duration-300 hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg">{blog.title}</CardTitle>
        <CardDescription>{blog.content}</CardDescription>
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
  );
};

export default BlogCard;
