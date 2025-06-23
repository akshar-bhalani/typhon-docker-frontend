import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { Button } from '../ui/button';
import { PaginationSettings } from '@/types';

interface PaginationProps {
  pagination: PaginationSettings;
  setPagination: React.Dispatch<React.SetStateAction<PaginationSettings>>;
  data: { next?: boolean };
}

function Pagination({ pagination, setPagination, data }: PaginationProps) {
  return (
    <div className="flex flex-col-reverse items-start justify-start gap-4 text-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-start gap-2">
        Rows per page
        <Select
          onValueChange={(value) =>
            setPagination((prev) => ({
              ...prev,
              limit: Number(value),
              page: 1,
            }))
          }
        >
          <SelectTrigger className="w-fit">
            <span>{pagination.limit}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col-reverse items-start justify-start gap-2 sm:flex-row sm:items-center sm:justify-end">
        <span>
          Page {pagination.page} {pagination.total && pagination.total !== 0 ? `of ${pagination.total}` : undefined}
        </span>
        <div className="space-x-1">
          <Button
            onClick={() => setPagination((prev) => ({ ...prev, page: 1 }))}
            disabled={pagination.page === 1}
            size="icon"
            variant="outline"
            title="First Page"
            className="cursor-pointer"
          >
            <ChevronsLeft />
          </Button>

          <Button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.max(prev.page - 1, 1),
              }))
            }
            disabled={pagination.page === 1}
            size="icon"
            variant="outline"
            title="Previous Page"
            className="cursor-pointer"
          >
            <ChevronLeft />
          </Button>

          <Button
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
            disabled={!data?.next}
            size="icon"
            variant="outline"
            title="Next Page"
            className="cursor-pointer"
          >
            <ChevronRight />
          </Button>

          <Button
            onClick={() => setPagination((prev) => ({ ...prev, page: pagination.total }))}
            disabled={!data?.next || pagination.page === pagination.total}
            size="icon"
            variant="outline"
            title="Last Page"
            className="cursor-pointer"
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
