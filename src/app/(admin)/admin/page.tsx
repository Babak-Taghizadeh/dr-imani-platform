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
    <main className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto max-w-6xl space-y-10 px-6 py-12">
        <AdminHeader />

        <Tabs defaultValue="blogs" className="space-y-8">
          <TabsList className="bg-muted/20 flex justify-center gap-6 rounded-lg p-4 shadow-md">
            <TabsTrigger value="blogs" className="flex items-center gap-2">
              <PenSquare className="h-5 w-5 text-blue-600" />
              مدیریت بلاگ‌ها
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              مدیریت مقالات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blogs" className="space-y-6">
            <BlogsManager
              blogs={blogs}
              page={blogsPage}
              totalPages={totalBlogs}
            />
          </TabsContent>

          <TabsContent value="articles">
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
