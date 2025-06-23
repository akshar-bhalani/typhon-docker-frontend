import {
  useAddBlogSetting,
  useDeleteBlogSettings,
  useEditBlogSetting,
  useGetBlogSettings,
  useGetWordPressKeys,
} from '@/api/userManagement';
import { queryKeys, useInvalidation } from '@/hooks/reactQuery';
import { toast } from '@/hooks/use-toast';
import { BlogsSettings } from '@/types';
import { useState } from 'react';
import { useParams } from 'react-router';
import { BlogSettingsForm } from './BlogSettingsForm';
import { DataTable } from './DataTable';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import ConfirmationDialog from './common/ConfirmationDialog';

export function BlogSettingsTable() {
  const params = useParams();
  const userId = params.id || '';
  const { data: blogSettings, isPending, error } = useGetBlogSettings(userId);
  const { data: wordPressKeys } = useGetWordPressKeys(userId);
  const { mutate: onUpdate } = useEditBlogSetting();
  const { mutate: onSave } = useAddBlogSetting();
  const { mutate: deleteSettings, isPending: isDeleting } = useDeleteBlogSettings();
  const { handleInvalidate } = useInvalidation([queryKeys.blogSettings]);
  const [editingSetting, setEditingSetting] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState<any>(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [settingToDelete, setSettingToDelete] = useState<string | null>(null);

  const handleEdit = (setting) => {
    setEditingSetting(setting);
  };

  const handleDeleteClick = (id: string) => {
    setSettingToDelete(id);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (settingToDelete) {
      deleteSettings(settingToDelete, {
        onSuccess: () => {
          handleInvalidate();
          toast({
            title: 'Blog Settings Deleted Successfully',
            description: 'Your settings has been deleted.',
          });
          setConfirmDelete(false);
          setSettingToDelete(null);
        },
        onError: (error) => {
          toast({
            title: 'Delete Blog Settings Failed',
            description: error.message || 'An error occurred.',
          });
          setConfirmDelete(false);
        },
      });
    }
  };

  const handleUpdate = (updatedSetting: BlogsSettings) => {
    onUpdate(updatedSetting, {
      onSuccess: () => {
        setIsDialogOpen(false);
        handleInvalidate();
        toast({
          title: 'Blog Settings Edited Successfully',
          description: 'Your blog settings has been edited.',
        });
        setEditingSetting(null);
      },
      onError: (error) => {
        toast({
          title: 'Edit Blog Settings Failed',
          description: error.message || 'An error occurred.',
        });
      },
    });
  };

  const handleSave = (newSetting: BlogsSettings) => {
    onSave(newSetting, {
      onSuccess: () => {
        setIsDialogOpen(false);
        handleInvalidate();
        toast({
          title: 'Blog Settings Added Successfully',
          description: 'Your blog settings has been added.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Add Blog Settings Failed',
          description: error.message || 'An error occurred.',
        });
      },
    });
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'wordpress_username',
      header: 'WordPress Key',
    },
    {
      accessorKey: 'frequency_value',
      header: 'Frequency',
    },
    {
      accessorKey: 'cycle_interval',
      header: 'Cycle Interval',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const setting = row.original;
        return (
          <div className="flex gap-2">
            <Dialog open={isDialogOpen === 'Edit'} onOpenChange={(open) => setIsDialogOpen(open ? 'Edit' : false)}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => handleEdit(setting)}>
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Blog Setting</DialogTitle>
                </DialogHeader>
                {editingSetting && (
                  <BlogSettingsForm
                    initialData={editingSetting}
                    onSubmit={handleUpdate}
                    wordpressKeys={wordPressKeys}
                  />
                )}
              </DialogContent>
            </Dialog>
            <Button
              className="ms-2"
              variant="outline"
              onClick={() => handleDeleteClick(setting.id || '')}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={blogSettings || []} isLoading={isPending} errorMessage={error?.message} />

      <Dialog open={isDialogOpen === 'Add'} onOpenChange={(open) => setIsDialogOpen(open ? 'Add' : false)}>
        <DialogTrigger asChild>
          <Button className="mt-4">Add New Blog Setting</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Blog Setting</DialogTitle>
          </DialogHeader>
          <BlogSettingsForm
            onSubmit={(newSetting) => {
              handleSave(newSetting);
            }}
            wordpressKeys={wordPressKeys}
          />
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Blog Setting"
        description="Are you sure you want to delete this blog setting? This action cannot be undone."
        isLoading={isDeleting}
      />
    </>
  );
}
