import Image from "next/image";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import getBlog from "@/utils/get-blog";

interface BlogPostPageProps {
  params: {
    id: string;
  };
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { id } = params;
  const blog = await getBlog(id);

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <header className="mb-8 space-y-4 text-right md:mb-8">
        <h1 className="text-3xl text-center font-bold md:text-5xl tracking-tight">{blog.title}</h1>
        <div className="text-muted-foreground flex items-center justify-end gap-2">
          <CalendarIcon className="h-4 w-4" />
          <time dateTime={blog.createdAt}>
            {new Date(blog.createdAt).toLocaleDateString("fa-IR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span className="mx-2">•</span>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium",
              blog.status === "منتشر شده"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800",
            )}
          >
            {blog.status}
          </span>
        </div>
      </header>
      <div className="relative mb-8 aspect-[21/9] w-full overflow-hidden rounded-sm md:mb-12">
        <Image
          src={blog.img}
          alt={blog.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>
      <div className="prose prose-lg prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline mx-auto max-w-none">
        <div className="text-right">
          <p className="leading-relaxed">{blog.content}</p>
        </div>
      </div>
    </article>
  );
};

export default BlogPostPage;
