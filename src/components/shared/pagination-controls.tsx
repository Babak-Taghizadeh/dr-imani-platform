"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { toPersianNumber } from "@/lib/persian-number-utils";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type PaginationMode = "url" | "callback";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  className?: string;
  theme?: "light" | "dark";

  // Navigation mode
  mode?: PaginationMode;

  // For URL mode
  queryKey?: string; // defaults to "page"
  preserveQueryParams?: boolean; // if true, uses pathname/searchParams

  // For callback mode
  onPageChange?: (page: number) => void;

  // Display options
  variant?: "full" | "simple"; // "full" = page numbers, "simple" = prev/next only
  maxVisiblePages?: number; // defaults to 5 (only for full variant)

  // Internationalization
  usePersianNumbers?: boolean; // defaults to false
  showPageInfo?: boolean; // show "صفحه X از Y" text (only for simple variant)
}

const PaginationControls = ({
  currentPage,
  totalPages,
  className,
  theme = "light",
  mode = "url",
  queryKey = "page",
  preserveQueryParams = false,
  onPageChange,
  variant = "full",
  maxVisiblePages = 5,
  usePersianNumbers = false,
  showPageInfo = false,
}: PaginationControlsProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hide pagination if only one page
  if (totalPages <= 1) {
    return null;
  }

  // Create URL for URL mode
  const createPageUrl = (page: number): string => {
    if (preserveQueryParams && pathname && searchParams) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(queryKey, page.toString());
      return `${pathname}?${params.toString()}`;
    }
    return `?${queryKey}=${page}`;
  };

  // Format page number based on Persian numbers setting
  const formatPageNumber = (page: number): string => {
    return usePersianNumbers ? toPersianNumber(page) : page.toString();
  };

  // Calculate page numbers to display (using better algorithm from admin version)
  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (variant === "simple") {
      return [];
    }

    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Styling classes for URL mode with theme support
  const linkBaseClass = cn("rounded-md px-3 py-1.5 text-sm transition-colors", {
    "text-gray-700 hover:bg-gray-100": theme === "light",
    "text-gray-200 hover:bg-gray-800": theme === "dark",
  });

  const activeLinkClass = cn(linkBaseClass, {
    "bg-gray-900 text-white": theme === "light",
    "bg-white text-black": theme === "dark",
  });

  // Render previous button
  const renderPrevious = () => {
    const prevPage = Math.max(1, currentPage - 1);
    const isDisabled = currentPage === 1;

    if (mode === "callback" && onPageChange) {
      return (
        <PaginationItem>
          <Button
            variant="ghost"
            size="default"
            onClick={() => onPageChange(prevPage)}
            disabled={isDisabled}
            className={cn(
              "gap-1 px-2.5 sm:pl-2.5",
              isDisabled && "pointer-events-none opacity-50",
            )}
          >
            <ChevronLeftIcon />
            <span className="hidden sm:block">قبلی</span>
          </Button>
        </PaginationItem>
      );
    }

    return (
      <PaginationItem>
        <PaginationPrevious
          href={createPageUrl(prevPage)}
          aria-disabled={isDisabled}
          className={cn(
            mode === "url" && !preserveQueryParams
              ? linkBaseClass
              : "text-foreground border-border bg-background hover:bg-accent",
            isDisabled && "pointer-events-none opacity-50",
          )}
        />
      </PaginationItem>
    );
  };

  // Render next button
  const renderNext = () => {
    const nextPage = Math.min(totalPages, currentPage + 1);
    const isDisabled = currentPage >= totalPages;

    if (mode === "callback" && onPageChange) {
      return (
        <PaginationItem>
          <Button
            variant="ghost"
            size="default"
            onClick={() => onPageChange(nextPage)}
            disabled={isDisabled}
            className={cn(
              "gap-1 px-2.5 sm:pr-2.5",
              isDisabled && "pointer-events-none opacity-50",
            )}
          >
            <span className="hidden sm:block">بعدی</span>
            <ChevronRightIcon />
          </Button>
        </PaginationItem>
      );
    }

    return (
      <PaginationItem>
        <PaginationNext
          href={createPageUrl(nextPage)}
          aria-disabled={isDisabled}
          className={cn(
            mode === "url" && !preserveQueryParams
              ? linkBaseClass
              : "text-foreground border-border bg-background hover:bg-accent",
            isDisabled && "pointer-events-none opacity-50",
          )}
        />
      </PaginationItem>
    );
  };

  // Render page numbers
  const renderPageNumbers = () => {
    if (variant === "simple") {
      return null;
    }

    return pageNumbers.map((page, index) => {
      if (page === "ellipsis") {
        return (
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const isActive = page === currentPage;

      if (mode === "callback" && onPageChange) {
        return (
          <PaginationItem key={page}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="icon"
              onClick={() => onPageChange(page)}
              className={cn(
                "h-9 w-9",
                isActive && "bg-primary text-primary-foreground",
              )}
            >
              {formatPageNumber(page)}
            </Button>
          </PaginationItem>
        );
      }

      return (
        <PaginationItem key={page}>
          <PaginationLink
            href={createPageUrl(page)}
            className={
              mode === "url" && !preserveQueryParams
                ? isActive
                  ? activeLinkClass
                  : linkBaseClass
                : undefined
            }
            isActive={isActive}
          >
            {formatPageNumber(page)}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  // Render page info text (for simple variant)
  const renderPageInfo = () => {
    if (variant === "simple" && showPageInfo) {
      return (
        <PaginationItem>
          <span className="flex items-center px-2 text-sm sm:px-4 sm:text-base">
            صفحه {formatPageNumber(currentPage)} از{" "}
            {formatPageNumber(totalPages)}
          </span>
        </PaginationItem>
      );
    }
    return null;
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        {renderPrevious()}
        {renderPageInfo()}
        {renderPageNumbers()}
        {renderNext()}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControls;
