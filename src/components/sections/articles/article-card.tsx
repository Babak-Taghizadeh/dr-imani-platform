import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../../ui/button";
import { Article } from "@/lib/types";
import Link from "next/link";
import { Download } from "lucide-react";

const ArticleCard = ({ article }: { article: Article }) => {
  console.log(article)
  return (
    <Card className="bg-secondary text-foreground gap-4">
      <CardHeader className="text-right">
        <CardTitle className="text-lg md:text-xl">{article.title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          تاریخ انتشار:{" "}
          {new Date(article.publishedAt).toLocaleDateString("fa-IR")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-right">
        <CardDescription className="text-secondary-foreground/70 line-clamp-2 text-sm md:text-base">
          {article.summary}
        </CardDescription>
      </CardContent>
      <CardFooter className="mt-auto mr-auto">
        <Link href={article.fileUrl} download>
          <Button>
            دانلود مقاله
            <Download />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
