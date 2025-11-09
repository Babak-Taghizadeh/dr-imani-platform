"use client";

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
import { Download, ExternalLink } from "lucide-react";
import useMediaQuery from "@/hooks/use-media-query";
import {
  createStaggeredAnimation,
  createViewportAnimation,
} from "@/lib/animations";
import { motion } from "motion/react";

interface ArticleCardProps {
  article: Article;
  index: number;
}

const ArticleCard = ({ article, index }: ArticleCardProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const desktopAnimation = createStaggeredAnimation({ index });
  const mobileAnimation = createViewportAnimation();
  return (
    <motion.div {...(isDesktop ? desktopAnimation : mobileAnimation)}>
      <Card className="bg-card/80 hover:bg-card/90 border-border/50 group transition-all hover:shadow-md">
        <CardHeader className="relative">
          <CardTitle className="text-primary/90 group-hover:text-primary transition-colors md:text-xl">
            {article.title}
          </CardTitle>
          <CardDescription className="text-accent-foreground/80 flex items-center justify-end absolute left-6 -top-3 mt-2 gap-1 text-xs">
            <span className="bg-chart-1/50 h-2 w-2 animate-pulse rounded-full" />
            تاریخ انتشار:{" "}
            {new Date(article.publishedAt).toLocaleDateString("fa-IR")}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative flex flex-col gap-3 pt-0 text-right">
          <div className="via-border/30 absolute top-0 left-4 h-full w-px bg-gradient-to-b from-transparent to-transparent" />

          <CardDescription className="line-clamp-3 leading-relaxed">
            {article.summary}
          </CardDescription>
        </CardContent>

        <CardFooter className="justify-end">
          {article.inputType === "file" && article.fileUrl ? (
            <Link href={article.fileUrl} download>
              <Button
                size="sm"
                variant="outline"
                className="!border-primary"
              >
                <Download className="ml-2 h-4 w-4 opacity-80 group-hover:opacity-100" />
                <span>دانلود مقاله</span>
              </Button>
            </Link>
          ) : article.inputType === "link" && article.scholarLink ? (
            <Link
              href={article.scholarLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="outline"
                className="!border-primary"
              >
                <ExternalLink className="ml-2 h-4 w-4 opacity-80 group-hover:opacity-100" />
                <span>مشاهده در گوگل اسکالر</span>
              </Button>
            </Link>
          ) : null}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ArticleCard;
