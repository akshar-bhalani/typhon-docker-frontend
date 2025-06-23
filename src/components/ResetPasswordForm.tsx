import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import useResetPassword from '@/api/password';

const formSchema = z.object({
  confirm_password: z.string().min(8, {
    message: 'Confirm Password must be same as password',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
});

export function ResetPasswordForm() {
  const { toast } = useToast();
  const { mutate, isPending } = useResetPassword();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirm_password: '',
      password: '',
    },
  });

  function onSubmit(values: any) {
    mutate(values, {
      onSuccess: () => {
        toast({
          title: 'Password Changed',
          description: 'Your password has been updated.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Reset Password Failed',
          description: error.message || 'An error occurred.',
        });
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Updating...' : 'Reset Password'}
        </Button>
      </form>
    </Form>
  );
}
