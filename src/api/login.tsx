import { useNavigate } from 'react-router-dom';

import api, { publicApi } from '@/api';
import { useMutation } from '@tanstack/react-query';
import { useAuthContext } from '@/hooks/AuthContext';
import { queryKeys, useInvalidation } from '@/hooks/reactQuery';

export const loginUser = async (request) => {
  const { data: responseData } = await publicApi.post('/login/', {
    ...request,
  });
  localStorage.setItem('accessToken', responseData.token);
  return responseData;
};

const useLoginUser = () => {
  const { setIsAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setIsAuthenticated(true);
      navigate('/');
    },
    onError: () => {
      // Handle error if needed
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending, // Corrected here
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

export default useLoginUser;

export const logoutUser = async () => {
  const { data: responseData } = await api.post('/logout/');
  localStorage.removeItem('accessToken');
  return responseData;
};

export const useLogoutUser = () => {
  const { setIsAuthenticated } = useAuthContext();
  const { handleInvalidate } = useInvalidation([
    queryKeys.user,
    queryKeys.profile,
    queryKeys.userSubscription,
    queryKeys.userPlanDetails,
    queryKeys.userPaymentHistory,
  ]);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      handleInvalidate();
      navigate('/');
      setTimeout(() => {
        setIsAuthenticated(false);
      }, 100);
    },
    onError: () => {
      // Handle error if needed
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending, // Corrected here
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};
