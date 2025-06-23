import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { PaginationSettings } from '@/types';
import SocialMediaForm from './SocialMediaForm';
import Pagination from '@/components/common/Pagination';
import { DataTable } from '@/components/DataTable';
import SearchInput from '@/components/common/SearchInput';
import { platformDisplayNames, TSocialMediaData, TSocialMediaPlatform } from '@/types/social-media';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { useGetProfile } from '@/api/userManagement';

interface ISocialMediaTableProps {
  platform: TSocialMediaPlatform;
  data: TSocialMediaData[];
  isLoading: boolean;
  error?: Error | null;
  pagination: PaginationSettings;
  setPagination: React.Dispatch<React.SetStateAction<PaginationSettings>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedDateRange?: DateRange | undefined;
  handleDateChange: (dateRange: DateRange | undefined) => void;
}

const SocialMediaTable = ({
  platform,
  data,
  isLoading,
  error,
  pagination,
  setPagination,
  searchTerm,
  setSearchTerm,
  handleDateChange,
  selectedDateRange,
}: ISocialMediaTableProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean | 'Add' | 'Edit'>(false);
  const [editingItem, setEditingItem] = useState<TSocialMediaData | null>(null);
  const { data: currentUser } = useGetProfile();

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
            accessorKey: 'username',
            header: 'Client',
            meta: {
              style: { minWidth: '100px' },
            },
          },
        ]
      : []),
    {
      accessorKey: 'link',
      header: 'Link',
      meta: {
        style: { minWidth: '200px' },
      },
      cell: ({ row }: { row: { original: TSocialMediaData } }) => {
        const value = row.original.link;
        return (
          <a href={value} target="_blank" rel="noreferrer" className="text-blue-500">
            {value}
          </a>
        );
      },
    },
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
      id: 'actions',
      cell: ({ row }: { row: { original: TSocialMediaData } }) => {
        const item = row.original;
        if (currentUser?.role === 'User') return undefined;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingItem(item);
                setIsDialogOpen('Edit');
              }}
            >
              Edit
            </Button>
            <Button variant="outline" size="sm">
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  // Get proper display name for the platform
  const displayName = platformDisplayNames[platform as keyof typeof platformDisplayNames] || platform;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{displayName}</h1>
        <Dialog open={isDialogOpen === 'Add'} onOpenChange={(open) => setIsDialogOpen(open ? 'Add' : false)}>
          {currentUser?.role !== 'User' && (
            <>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New {displayName} Post</DialogTitle>
                </DialogHeader>
                <SocialMediaForm platform={platform} onClose={() => setIsDialogOpen(false)} />
              </DialogContent>
            </>
          )}
        </Dialog>
      </div>

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        <SearchInput
          dataType={''}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          className="max-w-sm border-gray-400"
        />
        <DatePickerWithRange
          date={selectedDateRange}
          onDateChange={handleDateChange}
          disabledDates={(date) => date > new Date()}
          placeholderText="Published Date"
        />
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        errorMessage={error ? error.message : undefined}
      />

      <Pagination
        pagination={pagination}
        setPagination={setPagination}
        data={{ next: pagination.page < pagination.total }}
      />

      {/* Edit Dialog */}
      <Dialog
        open={isDialogOpen === 'Edit'}
        onOpenChange={(open) => {
          setIsDialogOpen(open ? 'Edit' : false);
          if (!open) setEditingItem(null);
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit {displayName} Post</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <SocialMediaForm platform={platform} initialData={editingItem} onClose={() => setIsDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialMediaTable;
