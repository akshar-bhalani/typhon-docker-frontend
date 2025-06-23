import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { WordPressKeys } from '@/types';
import { useParams } from 'react-router';

const formSchema = z.object({
  wordpress_api_key: z.string().min(1, {
    message: 'WordPress API Key is required.',
  }),
  wordpress_key_name: z.string().min(1, {
    message: 'WordPress Key Name is required.',
  }),
  wordpress_username: z.string().min(1, {
    message: 'WordPress User Name is required.',
  }),
  wordpress_url: z.string().min(1, {
    message: 'WordPress URL is required.',
  }),
});

const addInitialData = {
  wordpress_username: '',
  wordpress_url: '',
  wordpress_key_name: '',
  wordpress_api_key: '',
};

const editInitialData = {
  ...addInitialData,
  is_encrypted: false,
};

export function WordPressKeyForm({
  initialData,
  onSubmit,
  action,
}: {
  initialData?: WordPressKeys;
  onSubmit: any;
  action: 'add' | 'edit';
}) {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: action === 'add' ? addInitialData : initialData || editInitialData,
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const data = {
      ...values,
      wordpress_api_key: values.wordpress_api_key.replace(/\s+/g, '').trim(),
    };

    let payload: any;

    if (action === 'add') {
      payload = { ...data, user_id: params.id };
    }

    if (action === 'edit' && initialData) {
      payload = {};
      for (const key in data) {
        if (data[key] !== initialData[key]) {
          payload[key] = data[key];
        }
      }
      payload.user_id = params.id;
      payload.is_encrypted = data.wordpress_api_key === initialData.wordpress_api_key;
    }
    await onSubmit(payload);
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="wordpress_username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WordPress User Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter WordPress User Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wordpress_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WordPress URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter WordPress URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wordpress_key_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WordPress Key Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter WordPress Key Name" {...field} />
              </FormControl>
              <FormDescription>Enter the WordPress Key Name for this user</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wordpress_api_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WordPress API Key</FormLabel>
              <FormControl>
                <Input placeholder="Enter WordPress API Key" {...field} />
              </FormControl>
              <FormDescription>Enter the WordPress API Key for this user</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Wordpress Settings'}
        </Button>
      </form>
    </Form>
  );
}
