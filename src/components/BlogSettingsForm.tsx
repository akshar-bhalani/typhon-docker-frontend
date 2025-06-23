import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BlogsSettings, WordPressKeys } from '@/types';
import { useParams } from 'react-router';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Setting name must be at least 2 characters.',
  }),
  wordpress_id: z.string().min(1, {
    message: 'WordPress key is required.',
  }),
  frequency_value: z.enum(['daily', 'weekly', 'monthly']),
  cycle_interval: z.coerce.number().min(1, {
    message: 'Cycle interval must be a valid number.',
  }),
});

export function BlogSettingsForm({
  onSubmit,
  wordpressKeys,
  initialData,
}: {
  onSubmit: any;
  wordpressKeys: WordPressKeys[];
  initialData?: BlogsSettings;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          wordpress_id: `${initialData?.wordpress_id}`,
          cycle_interval: initialData?.cycle_interval,
        }
      : {
          name: '',
          wordpress_id: '',
          frequency_value: 'weekly',
          cycle_interval: 7,
        },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await onSubmit({ ...values, id: initialData?.id, user_id: params.id });
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Setting Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter setting name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wordpress_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WordPress Key</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select WordPress key" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {wordpressKeys.map((key) => (
                    <SelectItem key={key.id} value={`${key.id}`}>
                      {key.wordpress_key_name || key.wordpress_api_key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="frequency_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cycle_interval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cycle Interval</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter cycle interval" {...field} />
              </FormControl>
              <FormDescription>Number of days between each cycle</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Blog Settings'}
        </Button>
      </form>
    </Form>
  );
}
