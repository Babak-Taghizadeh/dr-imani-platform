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
import { useState } from "react";

const BlogCard = ({ blog }: { blog: Blog }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Card className="bg-background/95 text-foreground">
      <CardHeader>
        <div className="relative h-48 w-full">
          {isLoading && (
            <div className="bg-muted absolute inset-0 animate-pulse rounded-md" />
          )}
          <Image
            src={blog.img}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={80}
            loading="lazy"
            onLoadingComplete={() => setIsLoading(false)}
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
