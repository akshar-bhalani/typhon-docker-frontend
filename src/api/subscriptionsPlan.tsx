import api from '@/api';
import { Subscriptions } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/reactQuery';

const getAllPlans = async () => {
  const { data: responseData } = await api.get('/subscription-plans/list_subscription_plans/');
  return responseData;
};

export const useGetAllPlans = () => {
  return useQuery({
    queryKey: [queryKeys.subscription],
    queryFn: getAllPlans,
  });
};

const addSubscription = async (request: Subscriptions) => {
  const { data: responseData } = await api.post('/subscription-plans/add_subscription_plan/', {
    ...request,
  });
  return responseData;
};

export const useAddSubscription = () => {
  const mutation = useMutation({
    mutationFn: addSubscription,
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

const editSubscription = async (request: Subscriptions) => {
  const { data: responseData } = await api.patch(`/subscription-plans/update_subscription_plan/${request.id}/`, {
    ...request,
  });
  return responseData;
};

export const useEditSubscription = () => {
  const mutation = useMutation({
    mutationFn: editSubscription,
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

const createCheckoutSession = async (price_id: string) => {
  const { data: responseData } = await api.post('/stripe/create_checkout_session/', {
    price_id,
  });
  return responseData;
};

export const useCreateCheckoutSession = () => {
  const mutation = useMutation({
    mutationFn: createCheckoutSession,
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};
