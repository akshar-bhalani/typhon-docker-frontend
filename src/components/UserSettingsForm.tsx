import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Switch } from './ui/switch';

// change to correct fields and type when in use
const formSchema = z.object({
  email_notifications: z.boolean(),
  sms_notifications: z.boolean(),
  push_notifications: z.boolean(),
  newsletter_subscribed: z.boolean(),
  blog_update_notifications: z.boolean(),
  payment_notifications: z.boolean(),
  system_alerts: z.boolean(),
  notification_preference: z.enum(['email', 'sms', 'push']),
});

export function UserSettingsForm({ initialData, onSubmit }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
      newsletter_subscribed: true,
      blog_update_notifications: true,
      payment_notifications: true,
      system_alerts: true,
      notification_preference: 'email',
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await onSubmit(values);
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email_notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Email Notifications</FormLabel>
                <FormDescription>Receive notifications via email.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sms_notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">SMS Notifications</FormLabel>
                <FormDescription>Receive notifications via SMS.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="push_notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Push Notifications</FormLabel>
                <FormDescription>Receive push notifications.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newsletter_subscribed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Newsletter Subscription</FormLabel>
                <FormDescription>Receive our newsletter.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notification_preference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notification Preference</FormLabel>
              <FormControl>
                <Input placeholder="Enter notification preference" {...field} />
              </FormControl>
              <FormDescription>Your preferred method of receiving notifications.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </Form>
  );
}
