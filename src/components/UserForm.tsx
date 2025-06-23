import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAddUSer, useEditUser, useGetAdminsList } from '@/api/userManagement';
import { Users } from '@/types';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  role: z.enum(['User', 'Admin', 'SuperAdmin']),
  assigned_admin: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  company_name: z.string().optional(),
  phone: z.coerce.number().optional(),
});

type formFields = keyof z.infer<typeof formSchema>;

export function UserForm({
  disabledFields = [],
  hiddenFields,
  initialData,
  setIsDialogOpen,
  setEditingUser,
}: {
  disabledFields: formFields[];
  hiddenFields: formFields[];
  setEditingUser?: any;
  initialData?: any;
  setIsDialogOpen?: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: editUser } = useEditUser();
  const { mutate: addUser } = useAddUSer();
  const { data: admins } = useGetAdminsList();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          assigned_admin: initialData.assigned_admin
            ? admins?.find((admin: any) => admin.id === initialData.assigned_admin)?.name || ''
            : '',
        }
      : {
          name: '',
          email: '',
          role: 'User',
          assigned_admin: '',
          status: 'active',
          company_name: '',
          phone: '',
        },
  });

  const role = form.watch('role');

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // handle case of assign to user with value 'NA'
    if (values.assigned_admin === 'NA') {
      values.assigned_admin = '';
    } else {
      values.assigned_admin = admins?.find((admin: any) => admin.name === values.assigned_admin)?.id;
    }
    if (initialData) {
      handleEditUser({ ...initialData, ...values });
    } else {
      handleAddUser(values);
    }
  }

  const handleEditUser = (newUser: Users) => {
    return editUser(newUser, {
      onSuccess: () => {
        if (setEditingUser) {
          setEditingUser();
        }
        toast({
          title: 'User Edited Successfully',
          description: 'User has been edited.',
        });
        if (setIsDialogOpen) {
          setIsDialogOpen(false);
        }
        setIsLoading(false);
      },
      onError: (error) => {
        toast({
          title: 'Edit Plan Failed',
          description: error.message || 'An error occurred.',
        });
        setIsLoading(false);
      },
    });
  };

  const handleAddUser = (newUser: Users) => {
    return addUser(newUser, {
      onSuccess: () => {
        toast({
          title: 'User Added Successfully',
          description: 'User has been added.',
        });
        if (setIsDialogOpen) {
          setIsDialogOpen(false);
        }
        setIsLoading(false);
      },
      onError: (error) => {
        toast({
          title: 'Add USer Failed',
          description: error.message || 'An error occurred.',
        });
        setIsLoading(false);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            disabled={disabledFields.includes('name')}
            render={({ field }) => (
              <FormItem hidden={hiddenFields.includes('name')}>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            disabled={disabledFields.includes('email')}
            render={({ field }) => (
              <FormItem hidden={hiddenFields.includes('email')}>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem hidden={hiddenFields.includes('role')}>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={disabledFields.includes('role')}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="User">Client</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assigned_admin"
            render={({ field }) => (
              <FormItem hidden={hiddenFields.includes('assigned_admin')}>
                <FormLabel>Assign to Admin</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={role !== 'User' || disabledFields.includes('assigned_admin')}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an admin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NA">Select an admin</SelectItem>
                    {admins &&
                      admins.map((admin: any) => (
                        <SelectItem key={admin.id} value={admin.name}>
                          {admin.name}
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
            name="status"
            render={({ field }) => (
              <FormItem hidden={hiddenFields.includes('status')}>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={disabledFields.includes('status')}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company_name"
            disabled={disabledFields.includes('company_name')}
            render={({ field }) => (
              <FormItem hidden={hiddenFields.includes('company_name')}>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            disabled={disabledFields.includes('phone')}
            render={({ field }) => (
              <FormItem hidden={hiddenFields.includes('phone')}>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
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
