import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Article } from "@/lib/types";
import Link from "next/link";

const ArticleCard = ({ article }: { article: Article }) => {
  return (
    <Card
      className="bg-background/95 max-w-4xl gap-4 md:gap-6"
      key={article.id}
    >
      <CardHeader className="text-right">
        <CardTitle className="text-lg md:text-xl">{article.title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          تاریخ انتشار:{" "}
          {new Date(article.publishedAt).toLocaleDateString("fa-IR")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-right">
        <CardDescription className="text-muted-foreground text-sm md:text-base">
          {article.summary}
        </CardDescription>
        <div>
          <Link href={article.fileUrl} download>
            <Button>دانلود مقاله</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
