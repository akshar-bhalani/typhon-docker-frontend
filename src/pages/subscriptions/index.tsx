import { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { Button } from '../../components/ui/button';
import { Plus, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { SubscriptionForm } from '../../components/SubscriptionForm';
import { Subscriptions } from '@/types';
import { useGetAllPlans, useAddSubscription, useEditSubscription } from '@/api/subscriptionsPlan';
import { toast } from '@/hooks/use-toast';
import { queryKeys, useInvalidation } from '@/hooks/reactQuery';
import PlanCards from '@/components/subscriptions/PlanCards';

export default function SubscriptionsPage({ userRole }: { userRole: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState<any>(false);
  const [currentPlan, setCurrentPlan] = useState<Subscriptions | null>(null);
  const { mutate: addPlan } = useAddSubscription();
  const { mutate: editPlan } = useEditSubscription();
  const { handleInvalidate } = useInvalidation([queryKeys.subscription]);
  const { data: plansData, isLoading, error } = useGetAllPlans();

  const columns = [
    {
      accessorKey: 'name',
      header: 'Plan Name',
    },
    {
      accessorKey: 'price_per_month',
      header: 'Price',
    },
    {
      accessorKey: 'max_blogs_per_month',
      header: 'Max Blogs',
    },
    {
      accessorKey: 'max_refresh_count',
      header: 'Max Refresh',
    },
    {
      accessorKey: 'frequency',
      header: 'Frequency',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const plan = row.original;
        return userRole === 'SuperAdmin' ? (
          <Dialog
            open={isDialogOpen === 'Edit'}
            onOpenChange={(open) => {
              setIsDialogOpen(open ? 'Edit' : false);
              setCurrentPlan(open ? plan : null);
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => setCurrentPlan(plan)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Subscription Plan</DialogTitle>
                <DialogDescription>
                  Make changes to the subscription plan here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <SubscriptionForm initialData={currentPlan} onSubmit={handleEditPlan} />
            </DialogContent>
          </Dialog>
        ) : undefined;
      },
    },
  ];

  const handleAddPlan = (newPlan: Subscriptions) => {
    return addPlan(newPlan, {
      onSuccess: () => {
        handleInvalidate();
        toast({
          title: 'Plan Added Successfully',
          description: 'Your new plan has been added.',
        });
        setIsDialogOpen(false);
      },
      onError: (error) => {
        toast({
          title: 'Add Plan Failed',
          description: error.message || 'An error occurred.',
        });
      },
    });
  };

  const handleEditPlan = (newPlan: Subscriptions) => {
    return editPlan(newPlan, {
      onSuccess: () => {
        handleInvalidate();
        toast({
          title: 'Plan Edited Successfully',
          description: 'Your plan has been edited.',
        });
        setIsDialogOpen(false);
        setCurrentPlan(null);
      },
      onError: (error) => {
        toast({
          title: 'Edit Plan Failed',
          description: error.message || 'An error occurred.',
        });
      },
    });
  };

  if (!plansData) {
    return;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="w-full text-3xl font-bold">Subscription Plans</h1>
        {userRole === 'SuperAdmin' && (
          <Dialog open={isDialogOpen === 'Add'} onOpenChange={(open) => setIsDialogOpen(open ? 'Add' : false)}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Subscription Plan</DialogTitle>
                <DialogDescription>Create a new subscription plan here. Click save when you're done.</DialogDescription>
              </DialogHeader>
              <SubscriptionForm onSubmit={handleAddPlan} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      {userRole === 'Admin' || userRole === 'SuperAdmin' ? (
        <DataTable
          columns={columns}
          data={plansData || []}
          isLoading={isLoading}
          errorMessage={error ? error.message : undefined}
        />
      ) : (
        <PlanCards plans={plansData} />
      )}
    </div>
  );
}
