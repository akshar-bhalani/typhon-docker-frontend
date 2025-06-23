import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAddSocialMediaData, useEditSocialMediaData } from '@/api/social-media';
import { toast } from '@/hooks/use-toast';
import { TSocialMediaPlatform } from '@/types/social-media';
import { useGetAllActiveUsers } from '@/api/userManagement';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInvalidation } from '@/hooks/reactQuery';
import { Loader2 } from 'lucide-react';

// Updated schema to match API payload
const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  link: z.string().url({
    message: 'Please enter a valid URL.',
  }),
  publish_date: z.string(),
  user_id: z.coerce.number().min(1, {
    message: 'Please select a user.',
  }),
});

interface ISocialMediaFormProps {
  platform: TSocialMediaPlatform;
  initialData?: z.infer<typeof formSchema> & { id?: number };
  onClose: () => void;
}

export default function SocialMediaForm({ platform, initialData, onClose }: ISocialMediaFormProps) {
  const { mutate: addPost, isPending: isAddPending } = useAddSocialMediaData();
  const { mutate: editPost, isPending: isEditPending } = useEditSocialMediaData();
  const { data: users = [], isLoading: isLoadingUsers, error: usersError } = useGetAllActiveUsers();
  const { handleInvalidate } = useInvalidation(['socialmedia', platform]);

  const isPending = isAddPending || isEditPending;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      link: initialData?.link || '',
      publish_date: initialData?.publish_date
        ? initialData.publish_date.split('T')[0]
        : new Date().toISOString().split('T')[0],
      user_id: initialData?.user_id || -1,
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    if (initialData?.id) {
      handleEditPost({ ...initialData, ...values, id: initialData.id });
    } else {
      handleAddPost(values);
    }
  }

  const handleAddPost = (values: z.infer<typeof formSchema>) => {
    return addPost(
      {
        ...values,
        platform,
      },
      {
        onSuccess: () => {
          handleInvalidate();
          toast({
            title: 'Success!',
            description: 'Social media post entry has been added',
          });
          onClose();
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleEditPost = (newPost: z.infer<typeof formSchema> & { id: number }) => {
    return editPost(
      {
        ...newPost,
        platform,
      },
      {
        onSuccess: () => {
          handleInvalidate();
          toast({
            title: 'Success!',
            description: 'Social media post entry has been updated',
          });
          onClose();
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder={`Enter ${platform} post link`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                  disabled={isPending || isLoadingUsers}
                >
                  <FormControl>
                    <SelectTrigger>
                      {isLoadingUsers ? (
                        <div className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Loading users...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select user" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {usersError ? (
                      <div className="p-2 text-sm text-destructive">Failed to load users</div>
                    ) : isLoadingUsers ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    ) : users?.length === 0 ? (
                      <div className="p-2 text-sm">No users found</div>
                    ) : (
                      users?.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name || user.email || user.username}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publish_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publish Date</FormLabel>
                <FormControl>
                  <Input type="date" className="w-fit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData?.id ? 'Updating...' : 'Creating...'}
              </>
            ) : initialData?.id ? (
              'Update Post'
            ) : (
              'Create Post'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
