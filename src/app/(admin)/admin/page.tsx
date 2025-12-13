import AdminHeader from "@/components/sections/admin/admin-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BlogsManager from "@/components/sections/admin/blogs/blogs-manager";
import ArticlesManager from "@/components/sections/admin/articles/articles-manager";
import { fetchPaginatedData } from "@/utils/fetch-paginated-data";
import { Article, Blog } from "@/lib/types";
import { PenSquare, FileText } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "وبلاگ ها و مقالات",
  description: "سیستم احراز هویت مدیریت محتوای کلینیک تخصصی خواب",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
    },
  },
  other: {
    referrer: "no-referrer",
    "cache-control": "no-store, max-age=0",
  },
};

interface AdminPageProps {
  searchParams?: Promise<{
    blogsPage?: string;
    articlesPage?: string;
  }>;
}

const AdminPage = async ({ searchParams }: AdminPageProps) => {
  const params = await searchParams;
  const blogsPage = parseInt(params?.blogsPage || "1", 10);
  const articlesPage = parseInt(params?.articlesPage || "1", 10);

  const [
    { blogs, totalPages: totalBlogs },
    { articles, totalPages: totalArticles },
  ] = await Promise.all([
    fetchPaginatedData<Blog>("blogs", "blogs", blogsPage),
    fetchPaginatedData<Article>("articles", "articles", articlesPage),
  ]);

  return (
    <main className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <div className="container mx-auto max-w-6xl space-y-10 px-3 py-8 sm:px-4 sm:py-10 md:px-6 md:py-12">
        <AdminHeader />

        <Tabs defaultValue="blogs" className="space-y-6 sm:space-y-8">
          <TabsList className="bg-muted/20 flex w-full justify-center gap-2 rounded-lg p-2 shadow-md sm:gap-4 sm:p-4 md:gap-6">
            <TabsTrigger
              value="blogs"
              className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm md:text-base"
            >
              <PenSquare className="h-4 w-4 shrink-0 text-blue-600 sm:h-5 sm:w-5" />
              <span className="whitespace-nowrap">مدیریت بلاگ‌ها</span>
            </TabsTrigger>
            <TabsTrigger
              value="articles"
              className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm md:text-base"
            >
              <FileText className="h-4 w-4 shrink-0 text-purple-600 sm:h-5 sm:w-5" />
              <span className="whitespace-nowrap">مدیریت مقالات</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="blogs"
            className="min-w-0 space-y-6 overflow-x-hidden"
          >
            <BlogsManager
              blogs={blogs}
              page={blogsPage}
              totalPages={totalBlogs}
            />
          </TabsContent>

          <TabsContent
            value="articles"
            className="min-w-0 space-y-6 overflow-x-hidden"
          >
            <ArticlesManager
              articles={articles}
              totalPages={totalArticles}
              page={articlesPage}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default AdminPage;
