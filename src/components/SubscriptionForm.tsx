import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Plan name must be at least 2 characters.',
  }),
  description: z.string().min(2, {
    message: 'Plan name must be at least 2 characters.',
  }),
  price_per_month: z.coerce.number().min(1, {
    message: 'Price is required.',
  }),
  max_blogs_per_month: z.coerce.number().min(1, {
    message: 'Max blogs count is required.',
  }),
  max_refresh_count: z.coerce.number().min(1, {
    message: 'Max refresh count is required.',
  }),
  frequency: z.enum(['day', 'week', 'month', 'year']),
});

export function SubscriptionForm({ initialData, onSubmit }: { initialData?: any; onSubmit: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      price_per_month: '',
      max_blogs_per_month: '',
      max_refresh_count: '',
      frequency: 'month',
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await onSubmit({ id: initialData?.id, currency: 'usd', ...values });
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter plan name" {...field} />
                </FormControl>
                {/* <FormDescription>
                  The name of the subscription plan.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter description" {...field} />
                </FormControl>
                {/* <FormDescription>
                  The name of the subscription plan.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price_per_month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter price" {...field} />
                </FormControl>
                {/* <FormDescription>
                  The price of the subscription plan.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max_blogs_per_month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Blogs</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter max blogs" {...field} />
                </FormControl>
                {/* <FormDescription>
                  The maximum number of blogs allowed for this plan.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max_refresh_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Refresh</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter max refresh" {...field} />
                </FormControl>
                {/* <FormDescription>
                  The maximum number of blogs allowed for this plan.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="frequency"
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
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
                {/* <FormDescription>
                  The frequency of the subscription plan.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
          {isLoading ? 'Submitting...' : initialData ? 'Update Plan' : 'Add Plan'}
        </Button>
      </form>
    </Form>
  );
}
