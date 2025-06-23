import { useDeleteUser, useGetAllUsers, useGetProfile } from '@/api/userManagement';
import Pagination from '@/components/common/Pagination';
import SearchInput from '@/components/common/SearchInput';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { queryKeys, useInvalidation } from '@/hooks/reactQuery';
import { toast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { capitalizeFirstLetter } from '@/lib/utils';
import { PaginationSettings, Role, Status, Users } from '@/types';
import { Filter, Pencil, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
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
import { UserForm } from '../../components/UserForm';

const UserRoleValues = Object.values(Role);
const UserStatusValues = Object.values(Status);

export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState<'Edit' | 'Add' | false>(false);
  const [editingUser, setEditingUser] = useState<Users>();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [pagination, setPagination] = useState<PaginationSettings>({
    page: 1,
    order: 'desc',
    limit: 5,
    total: 0,
  });

  const [filters, setFilters] = useState<{
    role: (keyof typeof Role)[];
    status: (keyof typeof Status)[];
  }>({
    role: [],
    status: [],
  });

  const { data, isLoading, error } = useGetAllUsers(pagination, debouncedSearchTerm, filters.role, filters.status);
  const { data: currentUser } = useGetProfile();
  const { mutate: deleteUser, isPending } = useDeleteUser();
  const { handleInvalidate } = useInvalidation([queryKeys.users]);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

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

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete, {
        onSuccess: () => {
          handleInvalidate();
          toast({
            title: 'User Deleted Successfully',
            description: 'User has been deleted.',
          });
          setConfirmDelete(false);
          setUserToDelete(null);
        },
        onError: (error) => {
          toast({
            title: 'Failed to delete user',
            description: error.message || 'An error occurred.',
          });
          setConfirmDelete(false);
        },
      });
    }
  };

  // const handleSortClick = useCallback(() => {
  //   setPagination((prev) => ({
  //     ...prev,
  //     order: prev.order === 'asc' ? 'desc' : 'asc',
  //   }));
  // }, [setPagination]);

  const resetFilters = () => {
    setFilters({
      role: [],
      status: [],
    });
  };

  const handleFilterChange = (category: 'role' | 'status', value: string) => {
    setFilters((prev) => {
      let updated;
      if (category === 'role') {
        updated = prev[category].includes(value as keyof typeof Role)
          ? prev[category].filter((item) => item !== value)
          : [...prev[category], value];
      } else {
        updated = prev[category].includes(value as keyof typeof Status)
          ? prev[category].filter((item) => item !== value)
          : [...prev[category], value];
      }
      return { ...prev, [category]: updated };
    });
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role');
        return Role[role as keyof typeof Role];
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        return capitalizeFirstLetter(row.getValue('status'));
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Dialog
              open={isDialogOpen === 'Edit'}
              onOpenChange={(open) => {
                setEditingUser(user);
                setIsDialogOpen(open ? 'Edit' : false);
              }}
            >
              {(currentUser?.role === 'SuperAdmin' || currentUser?.role === 'Admin') && (
                <>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[560px]">
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                      <DialogDescription>Make changes to the user here. Click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <UserForm
                      disabledFields={
                        currentUser?.role === 'SuperAdmin' ? ['email'] : ['email', 'role', 'assigned_admin']
                      }
                      initialData={editingUser}
                      setIsDialogOpen={setIsDialogOpen}
                      setEditingUser={setEditingUser}
                      hiddenFields={[]}
                    />
                  </DialogContent>
                </>
              )}
            </Dialog>
            <Link to={`/users/${user.id}`}>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </Link>
            {currentUser?.role === 'SuperAdmin' && (
              <Button
                className="ms-2"
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteClick(user.id || '')}
                disabled={isPending}
              >
                Delete
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Users</h1>
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-col items-start gap-2 xsm:flex-row xsm:items-center">
          <SearchInput
            dataType="Users"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            className="max-w-sm border-gray-400"
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="-ms-1 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
                Filters
                {(filters.role.length > 0 || filters.status.length > 0) && (
                  <div className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {filters.role.length + filters.status.length}
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit min-w-36 space-y-3 p-3" align="start">
              {/* <SortFilter onChange={handleSortClick} order={pagination.order} className="text-xs" /> */}

              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Role</div>
                {UserRoleValues.map((role) => (
                  <div key={role} className="flex items-center gap-2">
                    <Checkbox
                      id={role}
                      checked={filters.role.includes(role as keyof typeof Role)}
                      onCheckedChange={() => handleFilterChange('role', role)}
                    />
                    <Label htmlFor={role} className="text-xs">
                      {role}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Status</div>
                {UserStatusValues.map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <Checkbox
                      id={status}
                      checked={filters.status.includes(status as unknown as keyof typeof Status)}
                      onCheckedChange={() => handleFilterChange('status', status)}
                    />
                    <Label htmlFor={status} className="text-xs">
                      {capitalizeFirstLetter(status)}
                    </Label>
                  </div>
                ))}
              </div>
              <Badge className="cursor-pointer select-none text-[10px]" onClick={resetFilters}>
                Clear All
              </Badge>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Dialog
            open={isDialogOpen === 'Add'}
            onOpenChange={(open) => {
              setIsDialogOpen(open ? 'Add' : false);
            }}
          >
            {currentUser?.role === 'SuperAdmin' && (
              <>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus /> Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[560px]">
                  <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>Create a new user here. Click save when you're done.</DialogDescription>
                  </DialogHeader>
                  <UserForm disabledFields={[]} hiddenFields={[]} setIsDialogOpen={setIsDialogOpen} />
                </DialogContent>
              </>
            )}
          </Dialog>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.results || []}
        isLoading={isLoading}
        errorMessage={error ? error?.message : undefined}
      />
      <Pagination pagination={pagination} setPagination={setPagination} data={data} />
      <ConfirmationDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        isLoading={isPending}
      />
    </div>
  );
}
