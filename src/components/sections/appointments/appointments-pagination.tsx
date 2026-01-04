"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toPersianNumber } from "@/lib/persian-number-utils";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface AppointmentsPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function AppointmentsPagination({
  currentPage,
  totalPages,
}: AppointmentsPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createPageUrl(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              className={cn(
                currentPage === 1 ? "pointer-events-none opacity-50" : "",
                "text-foreground border-border bg-background hover:bg-accent",
              )}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="flex items-center px-2 text-sm sm:px-4 sm:text-base">
              صفحه {toPersianNumber(currentPage)} از{" "}
              {toPersianNumber(totalPages)}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={createPageUrl(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage >= totalPages}
              className={cn(
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : "",
                "text-foreground border-border bg-background hover:bg-accent",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
