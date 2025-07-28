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
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  className?: string;
  theme?: "light" | "dark";
  queryKey: string;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  className,
  theme = "light",
  queryKey,
}: PaginationControlsProps) => {
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const linkBaseClass = cn("rounded-md px-3 py-1.5 text-sm transition-colors", {
    "text-gray-700 hover:bg-gray-100": theme === "light",
    "text-gray-200 hover:bg-gray-800": theme === "dark",
  });

  const activeLinkClass = cn(linkBaseClass, {
    "bg-gray-900 text-white": theme === "light",
    "bg-white text-black": theme === "dark",
  });

  const pages = [];

  if (startPage > 1) {
    pages.push(
      <PaginationItem key={1}>
        <PaginationLink href={`?${queryKey}=1`} className={linkBaseClass}>
          1
        </PaginationLink>
      </PaginationItem>,
    );
    if (startPage > 2) {
      pages.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <PaginationItem key={i}>
        <PaginationLink
          href={`?${queryKey}=${i}`}
          className={i === currentPage ? activeLinkClass : linkBaseClass}
        >
          {i}
        </PaginationLink>
      </PaginationItem>,
    );
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }
    pages.push(
      <PaginationItem key={totalPages}>
        <PaginationLink
          href={`?${queryKey}=${totalPages}`}
          className={linkBaseClass}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>,
    );
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?${queryKey}=${Math.max(currentPage - 1, 1)}`}
            aria-disabled={currentPage === 1}
            className={cn(
              linkBaseClass,
              currentPage === 1 && "pointer-events-none opacity-50",
            )}
          />
        </PaginationItem>

        {pages}

        <PaginationItem>
          <PaginationNext
            href={`?${queryKey}=${Math.min(currentPage + 1, totalPages)}`}
            aria-disabled={currentPage >= totalPages}
            className={cn(
              linkBaseClass,
              currentPage >= totalPages && "pointer-events-none opacity-50",
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControls;
