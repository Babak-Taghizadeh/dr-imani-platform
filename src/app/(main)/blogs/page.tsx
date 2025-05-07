import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockBlogs } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";

const BlogsPage = () => {
  return (
    <div className="bg-foreground p-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {mockBlogs.map((item, index) => (
        <Card key={index} className="bg-background text-foreground">
          <CardHeader>
            <div className="relative h-48 w-full">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="rounded-md object-cover"
              />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <CardDescription>{item.content}</CardDescription>
          </CardContent>
          <CardFooter>
            <Link className="" href={`/blogs/1`}>ادامه مطلب</Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BlogsPage;
