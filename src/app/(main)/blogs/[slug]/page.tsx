import Image from "next/image";
import { CalendarIcon } from "lucide-react";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import fetchBlog from "@/utils/fetch-blog";
import { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlog(slug);

  return {
    title: `${blog.title} | کلینیک خواب دکتر ایمانی`,
    description:
      blog.excerpt ||
      `${blog.title} - مقاله تخصصی درباره توسط کلینیک خواب دکتر ایمانی تبریز`,
    keywords: [
      "مقاله خواب",
      "تحقیق اختلالات خواب",
      blog.title.split(" ").slice(0, 3).join(" "),
      "دکتر ایمانی تبریز",
    ],
    openGraph: {
      title: blog.title,
      description: blog.excerpt || `مقاله تخصصی درباره ${blog.title}`,
      url: `/blogs/${slug}`,
      type: "article",
      publishedTime: blog.createdAt,
      images: [
        {
          url: `/api/upload/${blog.imageUrl}`,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt || `مقاله تخصصی درباره ${blog.title}`,
      images: [`/api/upload/${blog.imageUrl}`],
    },
    alternates: {
      canonical: `/blogs/${slug}`,
    },
    other: {
      "article:published_time": blog.createdAt,
      "article:author": "کلینیک خواب دکتر ایمانی",
      "article:section": "سلامت خواب",
    },
  };
}

const window = new JSDOM("").window as unknown as Window & {
  DocumentFragment: typeof DocumentFragment;
  HTMLTemplateElement: typeof HTMLTemplateElement;
  Node: typeof Node;
  Element: typeof Element;
  NodeFilter: typeof NodeFilter;
  NamedNodeMap: typeof NamedNodeMap;
  HTMLFormElement: typeof HTMLFormElement;
  DOMParser: typeof DOMParser;
};

const purify = DOMPurify(window);
const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;
  const blog = await fetchBlog(slug);
  const cleanContent = purify.sanitize(blog.content);
  return (
    <article className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <header
        aria-labelledby="article-header"
        className="mb-8 space-y-4 text-right md:mb-8"
      >
        <h1
          itemProp="headline"
          className="text-center text-2xl font-bold tracking-tight md:text-4xl"
        >
          {blog.title}
        </h1>
        <div
          aria-label="اطلاعات مقاله"
          className="text-muted-foreground flex items-center justify-end gap-2"
        >
          <CalendarIcon className="h-4 w-4" />
          <time
            dateTime={blog.createdAt}
            itemProp="datePublished"
            aria-label="تاریخ انتشار"
          >
            {new Date(blog.createdAt).toLocaleDateString("fa-IR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span aria-hidden="true" className="mx-2">
            •
          </span>
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            {blog.status}
          </span>
        </div>
      </header>
      <figure
        aria-labelledby="article-image"
        className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-sm md:mb-12 md:aspect-[20/9]"
      >
        <Image
          src={`/api/upload/${blog.imageUrl}`}
          alt={`تصویر مقاله: ${blog.title}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </figure>
      <div
        itemProp="articleBody"
        aria-label="محتوی مقاله"
        className="flex flex-col gap-3 [&>h2]:text-2xl [&>h2]:font-bold [&>h2:not(:first-child)]:mt-6 [&>p]:text-gray-600"
        dangerouslySetInnerHTML={{ __html: cleanContent }}
      />
    </article>
  );
};

export default BlogPostPage;
