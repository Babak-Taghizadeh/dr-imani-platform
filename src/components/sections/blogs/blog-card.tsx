"use client";

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
    <Card className="bg-card/80 hover:bg-card/90 border-border/50 group overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="relative">
        <div className="relative h-48 w-full overflow-hidden rounded-2xl lg:h-64">
          <Image
            src={blog.img}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={80}
            loading="lazy"
            className="object-cover transition-all duration-500 group-hover:scale-105"
          />
        </div>
        <div className="bg-card/90 text-accent-foreground/80 absolute top-4 right-8 rounded-full px-3 py-1 text-xs backdrop-blur-sm">
          <span className="bg-chart-4/50 ml-1 inline-block h-2 w-2 animate-pulse rounded-full" />
          {new Date(blog.createdAt).toLocaleDateString("fa-IR")}
        </div>
      </CardHeader>

      <CardContent>
        <CardTitle className="text-primary/90 group-hover:text-primary mb-2 transition-colors lg:text-xl">
          {blog.title}
        </CardTitle>
        <CardDescription className="line-clamp-3 leading-relaxed">
          {blog.excerpt}
        </CardDescription>
      </CardContent>

      <CardFooter className="justify-end">
        <Link
          className="text-primary flex items-center gap-1 text-sm transition-all hover:underline hover:underline-offset-4"
          href={`/blogs/${blog.id}`}
        >
          <span>ادامه مطلب</span>
          <ArrowLeft
            size={15}
            className="transition-transform group-hover:-translate-x-1"
          />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
