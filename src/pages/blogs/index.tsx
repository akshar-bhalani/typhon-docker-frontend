import { Blogs, PaginationSettings } from '@/types';
import { DataTable } from '../../components/DataTable';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { useGetAllBlogs, useGetBlogByID } from '@/api/blogs';
import { formatDate } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { Filter, Pencil } from 'lucide-react';
import { BlogForm } from '@/components/BlogForm';
import { useGetProfile } from '@/api/userManagement';
import SearchInput from '@/components/common/SearchInput';
import Pagination from '@/components/common/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { SortFilter } from '@/components/common/SortFilter';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function BlogsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState<any>(false);
  const [editingBlog, setEditingBlog] = useState<string>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [pagination, setPagination] = useState<PaginationSettings>({
    page: 1,
    order: 'desc',
    limit: 5,
    total: 0,
  });
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>();
  const { data, isLoading, error } = useGetAllBlogs(
    pagination,
    debouncedSearchTerm,
    selectedDateRange?.from,
    selectedDateRange?.to
  );
  const { data: currentBlog, isLoading: currentBlogLoading } = useGetBlogByID(editingBlog);
  const { data: currentUser } = useGetProfile();

  useEffect(() => {
    if (data) {
      setPagination((prev) => {
        const totalPages = Math.ceil(data.count / prev.limit);

        return {
          ...prev,
          page: Math.min(prev.page, totalPages) || 1,
          total: totalPages,
        };
      });
    }
  }, [data]);

  // const handleSortClick = useCallback(() => {
  //   setPagination((prev) => ({
  //     ...prev,
  //     order: prev.order === 'asc' ? 'desc' : 'asc',
  //   }));
  // }, [setPagination]);

  const handleDateChange = (dateRange: DateRange | undefined) => {
    setSelectedDateRange(dateRange);
  };

  const columns = [
    {
      accessorKey: 'title',
      header: 'Title',
      meta: {
        style: { minWidth: '180px', maxWidth: '250px' },
      },
    },
    ...(currentUser?.role !== 'User'
      ? [
          {
            accessorKey: 'wordpress_username',
            header: 'Client',
            meta: {
              style: { minWidth: '100px' },
            },
          },
        ]
      : []),
    {
      accessorKey: 'publish_date',
      header: 'Publish Date',
      meta: {
        style: { minWidth: '100px' },
      },
      cell: ({ row }) => {
        const value = formatDate(row.original.publish_date || new Date());
        return value;
      },
    },
    {
      accessorKey: 'link',
      header: 'Link',
      meta: {
        style: { minWidth: '200px' },
      },
      cell: ({ row }) => {
        const value = row.original.link;
        return (
          <a href={value} target="_blank" rel="noreferrer" className="text-blue-500">
            {value}
          </a>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const blog = row.original;
        if (currentUser?.role === 'User') return undefined;
        return (
          <div className="flex items-center space-x-2">
            <Dialog
              open={isDialogOpen === 'Edit'}
              onOpenChange={(open) => {
                setEditingBlog(blog.id);
                setIsDialogOpen(open ? 'Edit' : false);
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-1/2 w-1/2">
                <DialogHeader>
                  <DialogTitle>Edit Blog</DialogTitle>
                  <DialogDescription>Make changes to the blog here. Click save when you're done.</DialogDescription>
                </DialogHeader>
                {currentBlogLoading ? (
                  <div>Loading...</div>
                ) : currentBlog ? (
                  <BlogForm
                    initialData={currentBlog ? { ...currentBlog, id: editingBlog } : undefined}
                    setIsDialogOpen={setIsDialogOpen}
                    setEditingBlog={setEditingBlog}
                  />
                ) : (
                  <div>Blog not found</div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blogs</h1>
      </div>
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        <SearchInput
          dataType="Users"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          className="max-w-sm border-gray-400"
        />
        <div className="flex gap-2">
          <DatePickerWithRange
            date={selectedDateRange}
            onDateChange={handleDateChange}
            disabledDates={(date) => date > new Date()}
            placeholderText="Published Date"
          />
          {/* <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="-ms-1 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit min-w-36 space-y-3 p-3" align="start">
              <SortFilter onChange={handleSortClick} order={pagination.order} className="text-xs" />
            </PopoverContent>
          </Popover> */}
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data?.results || []}
        isLoading={isLoading}
        errorMessage={error ? error.message : undefined}
      />
      <Pagination pagination={pagination} setPagination={setPagination} data={data} />
    </div>
  );
}
