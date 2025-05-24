import { CaretLeft, CaretRight, DotsThree } from "@phosphor-icons/react";
import { Button } from "@/ui/Button.ui";
import { DASHBOARD_PAGINATION } from "@/constants/dashboard.constants";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  isLoading?: boolean;
}

export const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onPageSizeChange,
  onNextPage,
  onPreviousPage,
  isLoading = false,
}: PaginationProps) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculate range display
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  if (totalPages <= 1) {
    return null; // Don't show pagination for single page
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Results info */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {startItem}-{endItem} of {totalCount} results
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Show:</span>
          <select
            value={pageSize.toString()}
            onChange={e => onPageSizeChange(parseInt(e.target.value))}
            disabled={isLoading}
            className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
          >
            {DASHBOARD_PAGINATION.PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size.toString()}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousPage}
            disabled={!hasPreviousPage || isLoading}
            className="h-9 w-9 p-0"
          >
            <CaretLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <div className="flex h-9 w-9 items-center justify-center">
                    <DotsThree className="h-4 w-4 text-gray-400" />
                  </div>
                ) : (
                  <Button
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    disabled={isLoading}
                    className="h-9 w-9 p-0"
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={!hasNextPage || isLoading}
            className="h-9 w-9 p-0"
          >
            <CaretRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
