import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export const ArticlesLoader = () => {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="bg-secondary text-foreground gap-4">
          <CardHeader className="text-right">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="mt-2 h-4 w-32" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-right">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter className="mt-auto mr-auto">
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};
