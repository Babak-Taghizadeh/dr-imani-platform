import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BlogsLoader = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_: unknown, index: number) => (
        <Card key={index} className="bg-background text-foreground">
          <CardHeader>
            <Skeleton className="h-48 w-full rounded-md" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-24" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default BlogsLoader;
