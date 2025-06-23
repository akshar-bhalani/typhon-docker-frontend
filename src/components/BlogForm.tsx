import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import EditorComponent, { EditorComponentRef } from './EditorComponent';
import { queryKeys, useInvalidation } from '@/hooks/reactQuery';
import { Blogs } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useEditBlog } from '@/api/blogs';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  content: z.string().min(2, {
    message: 'Content must be at least 2 characters.',
  }),
  excerpt: z.string().min(2, {
    message: 'Excerpt must be at least 2 characters.',
  }),
});

export function BlogForm({
  initialData,
  setIsDialogOpen,
  setEditingBlog,
}: {
  setEditingBlog?: any;
  initialData?: any;
  setIsDialogOpen?: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: editBlog } = useEditBlog();
  const { handleInvalidate } = useInvalidation([queryKeys.blog, initialData?.id]);
  const contentRef = useRef<EditorComponentRef>(null);
  const excerptRef = useRef<EditorComponentRef>(null);

  useEffect(() => {
    if (contentRef.current?.setEditorContent) {
      contentRef.current.setEditorContent(initialData?.content || '');
    }

    if (excerptRef.current?.setEditorContent) {
      excerptRef.current.setEditorContent(initialData?.excerpt || '');
    }
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: '',
      content: '',
      excerpt: '',
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    handleEditBlog({ ...initialData, ...values });
  }

  const handleEditBlog = (newBlog: Blogs) => {
    return editBlog(newBlog, {
      onSuccess: () => {
        handleInvalidate();
        if (setEditingBlog) {
          setEditingBlog();
        }
        toast({
          title: 'Blog Edited Successfully',
          description: 'Blog has been edited.',
        });
        if (setIsDialogOpen) {
          setIsDialogOpen(false);
        }
        setIsLoading(false);
      },
      onError: (error) => {
        toast({
          title: 'Edit Blog Failed',
          description: error.message || 'An error occurred.',
        });
        setIsLoading(false);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="max-h-[80vh] space-y-6 overflow-y-auto">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <EditorComponent
                    ref={contentRef}
                    content={initialData?.content || ''}
                    setValue={form.setValue}
                    name="content"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <EditorComponent
                    ref={excerptRef}
                    content={initialData?.excerpt || ''}
                    setValue={form.setValue}
                    name="excerpt"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
