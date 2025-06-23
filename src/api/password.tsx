import { useNavigate, useParams } from 'react-router-dom';

import { publicApi } from '@/api';
import { useMutation } from '@tanstack/react-query';
import { useAuthContext } from '@/hooks/AuthContext';

export const resetPassword = async (request, params) => {
  const { data: responseData } = await publicApi.post(`users/password-setup/${params.id}/${params.token}/`, {
    ...request,
  });
  return responseData;
};

const useResetPassword = () => {
  const { setIsAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const params = useParams();

  const mutation = useMutation({
    mutationFn: (request) => resetPassword(request, params),
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

export default useResetPassword;
