import AdminHeader from "@/components/sections/admin/admin-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BlogsManager from "@/components/sections/admin/blogs/blogs-manager";
import ArticlesManager from "@/components/sections/admin/articles/articles-manager";
import { fetchPaginatedData } from "@/utils/fetch-paginated-data";
import { Article, Blog } from "@/lib/types";

interface AdminPageProps {
  searchParams?: {
    blogsPage?: string;
    articlesPage?: string;
  };
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
            <TabsTrigger value="blogs">📝 مدیریت بلاگ‌ها</TabsTrigger>
            <TabsTrigger value="articles">📚 مدیریت مقالات</TabsTrigger>
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
