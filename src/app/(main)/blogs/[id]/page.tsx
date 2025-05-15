import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockBlogs } from "@/lib/mock-data";
import Image from "next/image";

const BlogPage = () => {
  const { content, img, title, createdAt } = mockBlogs[0];
  return (
    <article className="bg-foreground p-12 min-h-[90dvh]">
      <Card className="bg-foreground border border-white text-background mx-auto max-w-3xl border-none">
        <CardHeader>
          <div className="relative h-64 w-full">
            <Image
              src={img}
              alt={title}
              fill
              className="rounded-md object-cover"
            />
          </div>
          <CardTitle className="mt-4 text-2xl">{title}</CardTitle>

          <CardDescription className="mt-2">
            تاریخ انتشار : {new Date(createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>{content}</p>
          </div>
        </CardContent>
      </Card>
    </article>
  );
};

export default BlogPage;
