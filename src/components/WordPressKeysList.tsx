import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { useEditWordPressKeys, useDeleteWordPressKeys, useAddWordPressKeys } from '@/api/userManagement';
import { WordPressKeys } from '@/types';
import { toast } from '@/hooks/use-toast';
import { queryKeys, useInvalidation } from '@/hooks/reactQuery';
import { useState } from 'react';
import { WordPressKeyForm } from './WordPressKeyForm';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useGetWordPressKeys } from '@/api/userManagement';
import { useParams } from 'react-router';
import ConfirmationDialog from './common/ConfirmationDialog';

export function WordPressKeysList() {
  const params = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState<any>(false);
  const [editingSetting, setEditingSetting] = useState<WordPressKeys>();
  const { data: wordPressKeys, isPending, error } = useGetWordPressKeys(params.id);
  const { mutate: editKeys } = useEditWordPressKeys();
  const { mutate: addKeys } = useAddWordPressKeys();
  const { mutate: deleteKeys, isPending: isDeletePending } = useDeleteWordPressKeys();
  const { handleInvalidate } = useInvalidation([queryKeys.wordpress]);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  const handleEdit = (setting: WordPressKeys) => {
    setEditingSetting(setting);
  };

  const updateKey = (newSettings: WordPressKeys) => {
    return editKeys(
      { ...newSettings, id: editingSetting?.id },
      {
        onSuccess: () => {
          handleInvalidate();
          setEditingSetting(undefined);
          setIsDialogOpen(false);
          toast({
            title: 'Wordpress Settings Edited Successfully',
            description: 'Your settings has been edited.',
          });
        },
        onError: (error) => {
          toast({
            title: 'Edit Wordpress Settings Failed',
            description: error.message || 'An error occurred.',
          });
        },
      }
    );
  };

  const addKey = (newSettings: WordPressKeys) => {
    return addKeys(newSettings, {
      onSuccess: () => {
        handleInvalidate();
        setIsDialogOpen(false);
        toast({
          title: 'Wordpress Settings Added Successfully',
          description: 'Your settings has been added.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Add Wordpress Settings Failed',
          description: error.message || 'An error occurred.',
        });
      },
    });
  };

  const handleDeleteClick = (id: string) => {
    setKeyToDelete(id);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (keyToDelete) {
      deleteKeys(keyToDelete, {
        onSuccess: () => {
          handleInvalidate();
          toast({
            title: 'Wordpress Settings Deleted Successfully',
            description: 'Your settings has been deleted.',
          });
          setConfirmDelete(false);
          setKeyToDelete(null);
        },
        onError: (error) => {
          toast({
            title: 'Delete Wordpress Settings Failed',
            description: error.message || 'An error occurred.',
          });
          setConfirmDelete(false);
        },
      });
    }
  };

  const columns: ColumnDef<WordPressKeys>[] = [
    {
      accessorKey: 'wordpress_username',
      header: 'User Name',
    },
    {
      accessorKey: 'wordpress_key_name',
      header: 'Key Name',
    },
    {
      accessorKey: 'wordpress_url',
      header: 'Website Url',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const setting = row.original;
        return (
          <div>
            <Dialog open={isDialogOpen === 'Edit'} onOpenChange={(open) => setIsDialogOpen(open ? 'Edit' : false)}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => handleEdit(setting)}>
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Wordpress Configs</DialogTitle>
                </DialogHeader>
                {editingSetting && <WordPressKeyForm initialData={editingSetting} onSubmit={updateKey} action="edit" />}
              </DialogContent>
            </Dialog>
            <Button
              className="ms-2"
              variant="outline"
              onClick={() => handleDeleteClick(setting.id || '')}
              disabled={isDeletePending}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={wordPressKeys || []} isLoading={isPending} errorMessage={error?.message} />

      <Dialog open={isDialogOpen === 'Add'} onOpenChange={(open) => setIsDialogOpen(open ? 'Add' : false)}>
        <DialogTrigger asChild>
          <Button className="mt-4">Add New Wordpress Configs</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Wordpress Configs</DialogTitle>
          </DialogHeader>
          <WordPressKeyForm onSubmit={addKey} action="add" />
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        title="Delete WordPress Configuration"
        description="Are you sure you want to delete this WordPress configuration? This action cannot be undone."
        isLoading={isDeletePending}
      />
    </div>
  );
}
