import { useState, useEffect } from 'react';
import { DataTable } from './DataTable';
import { useParams } from 'react-router';
import { toast } from '@/hooks/use-toast';
import { queryKeys, useInvalidation } from '@/hooks/reactQuery';
import { Button } from './ui/button';
import { Pencil, Plus, Trash, CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import {
  useEditBlogTopic,
  useGetBlogTopics,
  useAddBlogTopic,
  useDeleteBlogTopic,
  useGetTopicsByDate,
} from '@/api/blogs';
import { TBlogTopicEditPayload, TBlogTopicResponse } from '@/types/blogs';
import { formatDate } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { PaginationSettings } from '@/types';
import Pagination from './common/Pagination';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import SearchInput from './common/SearchInput';
import { useDebounce } from '@/hooks/useDebounce';

// Get today's date at midnight (with timezone adjustment)
const today = new Date();
today.setHours(0, 0, 0, 0);

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required.',
  }),
  usage_date: z
    .string()
    .min(1, {
      message: 'Date is required.',
    })
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);

        // Compare dates using getTime to avoid timezone issues
        return selectedDate.getTime() >= today.getTime();
      },
      {
        message: 'Date must be today or later.',
      }
    ),
  primary_keyword: z.string().min(1, {
    message: 'Primary keyword is required.',
  }),
  secondary_keyword: z.string().optional(),
});

export function BlogTopics() {
  const params = useParams();
  const userId = params.id || '';

  const [pagination, setPagination] = useState<PaginationSettings>({
    page: 1,
    order: 'desc',
    limit: 10,
    total: 0,
  });

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dateValidationError, setDateValidationError] = useState<string | null>(null);

  const { data, isPending, error } = useGetBlogTopics(
    userId,
    pagination,
    dateRange?.from,
    dateRange?.to,
    debouncedSearchTerm
  );

  const { data: topicsForSelectedDate } = useGetTopicsByDate(userId, selectedDate);

  const { mutate: addTopic } = useAddBlogTopic();
  const { mutate: editTopic } = useEditBlogTopic();
  const { mutate: deleteTopic } = useDeleteBlogTopic();
  const { handleInvalidate } = useInvalidation([queryKeys.blogTopics, queryKeys.blogTopicsByDate]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TBlogTopicResponse | null>(null);
  const [topicToDelete, setTopicToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewTopic, setIsNewTopic] = useState(false);

  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        total: Math.ceil(data.count / prev.limit),
      }));
    }
  }, [data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      usage_date: new Date().toISOString().split('T')[0],
      primary_keyword: '',
      secondary_keyword: '',
    },
  });

  // Watch for date changes in the form
  const selectedFormDate = form.watch('usage_date');

  useEffect(() => {
    if (selectedFormDate) {
      setSelectedDate(selectedFormDate);
      // Clear previous validation error when date changes
      setDateValidationError(null);
    }
  }, [selectedFormDate]);

  const validateTopicsPerDate = () => {
    if (!topicsForSelectedDate) return true;

    // If we're editing an existing topic for the same date, exclude it from the count
    const existingTopicsForDate = topicsForSelectedDate.results.filter((topic) => {
      if (!editingTopic) return true;
      return topic.id !== editingTopic.id;
    });

    if (existingTopicsForDate.length >= 3) {
      setDateValidationError(
        `You already have 3 topics for ${formatDate(selectedDate)}. Please select a different date.`
      );
      return false;
    }

    return true;
  };

  const handleEdit = (topic: TBlogTopicResponse) => {
    setEditingTopic(topic);
    setIsNewTopic(false);
    form.reset({
      title: topic.title,
      usage_date: topic.usage_date,
      primary_keyword: topic.primary_keyword,
      secondary_keyword: topic.secondary_keyword || '',
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingTopic(null);
    setIsNewTopic(true);
    // Set the date to today
    form.reset({
      title: '',
      usage_date: new Date().toISOString().split('T')[0],
      primary_keyword: '',
      secondary_keyword: '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTopicToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!topicToDelete) return;

    setIsLoading(true);
    deleteTopic(topicToDelete, {
      onSuccess: () => {
        handleInvalidate();
        setIsDeleteDialogOpen(false);
        toast({
          title: 'Topic Deleted',
          description: 'The blog topic has been deleted successfully',
        });
        setIsLoading(false);
      },
      onError: (error) => {
        toast({
          title: 'Delete Failed',
          description: error.message || 'An error occurred while deleting the topic',
          variant: 'destructive',
        });
        setIsLoading(false);
      },
    });
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // First check if we already have 3 topics for this date
    if (!validateTopicsPerDate()) {
      return;
    }

    setIsLoading(true);

    if (isNewTopic) {
      // Create a new topic
      const newTopic: TBlogTopicEditPayload = {
        user: Number(userId),
        title: values.title,
        usage_date: values.usage_date,
        primary_keyword: values.primary_keyword,
        secondary_keyword: values.secondary_keyword,
      };

      addTopic(newTopic, {
        onSuccess: () => {
          handleInvalidate();
          setIsDialogOpen(false);
          toast({
            title: 'Topic Created',
            description: 'The blog topic has been created successfully',
          });
          setIsLoading(false);
        },
        onError: (error) => {
          toast({
            title: 'Creation Failed',
            description: error.message || 'An error occurred while creating the topic',
            variant: 'destructive',
          });
          setIsLoading(false);
        },
      });
    } else if (editingTopic) {
      // Update existing topic
      const updatedTopic: TBlogTopicEditPayload & { id: number } = {
        id: editingTopic.id,
        user: Number(userId),
        title: values.title,
        usage_date: values.usage_date,
        primary_keyword: values.primary_keyword,
        secondary_keyword: values.secondary_keyword,
      };

      editTopic(updatedTopic, {
        onSuccess: () => {
          handleInvalidate();
          setIsDialogOpen(false);
          toast({
            title: 'Topic Updated',
            description: 'The blog topic has been updated successfully',
          });
          setIsLoading(false);
        },
        onError: (error) => {
          toast({
            title: 'Update Failed',
            description: error.message || 'An error occurred while updating the topic',
            variant: 'destructive',
          });
          setIsLoading(false);
        },
      });
    }
  };

  const columns = [
    {
      accessorKey: 'usage_date',
      header: 'Date',
      cell: ({ row }) => {
        return formatDate(row.original.usage_date || new Date());
      },
    },
    {
      accessorKey: 'title',
      header: 'Topic',
    },
    {
      accessorKey: 'primary_keyword',
      header: 'Primary Keyword',
    },
    {
      accessorKey: 'secondary_keyword',
      header: 'Secondary Keyword',
      cell: ({ row }) => {
        return row.original.secondary_keyword || '-';
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const topic = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(topic)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(topic.id)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const clearDateFilter = () => {
    setDateRange(undefined);
  };

  return (
    <div className="space-y-6 py-3">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold">Blog Topics</h2>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap">
          <SearchInput
            dataType="Topics"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            className="w-full max-w-sm border-gray-400 sm:w-auto"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[180px] justify-start text-left font-normal',
                  !dateRange?.from && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Filter by date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={(range) => setDateRange(range)}
                numberOfMonths={2}
              />
              <div className="flex justify-end border-t border-border p-3">
                <Button variant="ghost" size="sm" onClick={clearDateFilter}>
                  Clear
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Topic
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={data?.results || []} isLoading={isPending} errorMessage={error?.message} />

      {data && <Pagination pagination={pagination} setPagination={setPagination} data={{ next: data.next !== null }} />}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isNewTopic ? 'Add Blog Topic' : 'Edit Blog Topic'}</DialogTitle>
            <DialogDescription>
              {isNewTopic ? 'Create a new blog topic' : 'Make changes to the blog topic'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usage_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" min={today.toISOString().split('T')[0]} {...field} />
                    </FormControl>
                    <FormMessage />
                    {dateValidationError && (
                      <p className="mt-1 text-sm font-medium text-destructive">{dateValidationError}</p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primary_keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Keyword</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter primary keyword" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondary_keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Keyword (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter secondary keyword" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog topic.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
