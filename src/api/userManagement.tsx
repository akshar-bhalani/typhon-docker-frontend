import api from '@/api';
import { BlogsSettings, IUserParametersPayload, PaginationSettings, Role, Status, Users, WordPressKeys } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/reactQuery';

const getAllUsers = async (
  order: 'asc' | 'desc' = 'desc',
  limit: number = 10,
  page: number = 1,
  search: string = '',
  role?: (keyof typeof Role)[],
  status?: (keyof typeof Status)[]
) => {
  const offset = (page - 1) * limit;

  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
    order,
  });

  if (search) params.append('search', search);
  if (role) params.append('role', role.toString());
  if (status) params.append('status', status.toString());

  const { data: responseData } = await api.get(`/users/list_users?${params.toString()}`);
  return responseData;
};

export const useGetAllUsers = (
  pagination: PaginationSettings,
  searchTerm: string,
  role?: (keyof typeof Role)[],
  status?: (keyof typeof Status)[]
) => {
  return useQuery({
    queryKey: [queryKeys.users, pagination, searchTerm, role, status],
    queryFn: () => getAllUsers(pagination.order, pagination.limit, pagination.page, searchTerm, role, status),
  });
};

const getAllActiveUsers = async () => {
  const { data: responseData } = await api.get(`/users/list_users?all=true&role=User&status=active`);
  return responseData;
};

export const useGetAllActiveUsers = () => {
  return useQuery({
    queryKey: [queryKeys.allActiveUsers],
    queryFn: () => getAllActiveUsers(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const addUser = async (request: Users) => {
  const { data: responseData } = await api.post('/users/add_user/', {
    ...request,
  });
  return responseData;
};

export const useAddUSer = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.allActiveUsers] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.admins] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.profile] });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

const editUser = async (request: Users) => {
  const { data: responseData } = await api.put(`/users/update_user/${request.id}`, {
    ...request,
  });
  return responseData;
};

export const useEditUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.allActiveUsers] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.admins] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.profile] });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

const getProfile = async () => {
  const { data: responseData } = await api.get(`/profile/`);
  return responseData;
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: [queryKeys.profile],
    queryFn: () => getProfile(),
  });
};

const getUserById = async (id?: string) => {
  const { data: responseData } = await api.get(`/users/get_user/${id}`);
  return responseData;
};

export const useGetUserByID = (id?: string) => {
  return useQuery({
    queryKey: [queryKeys.user, id],
    queryFn: () => getUserById(id),
  });
};

const deleteUser = async (id: string) => {
  const { data: responseData } = await api.delete(`users/delete_user/${id}`, {});
  return responseData;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.allActiveUsers] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.admins] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.profile] });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

//blogs settings apis

const getBlogSettings = async (id: string) => {
  const { data: responseData } = await api.get(`/blogsettingviewset/list_blog_setting/${id}`);
  return responseData;
};

export const useGetBlogSettings = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.blogSettings, id],
    queryFn: () => getBlogSettings(id),
  });
};

const addBlogSetting = async (request: BlogsSettings) => {
  const { data: responseData } = await api.post('/blogsettingviewset/add_blog_setting/', {
    ...request,
  });
  return responseData;
};

export const useAddBlogSetting = () => {
  const mutation = useMutation({
    mutationFn: addBlogSetting,
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

const editBlogSetting = async (request: BlogsSettings) => {
  const { data: responseData } = await api.patch(`/blogsettingviewset/update_blog_setting/${request.id}`, {
    ...request,
  });
  return responseData;
};

export const useEditBlogSetting = () => {
  const mutation = useMutation({
    mutationFn: editBlogSetting,
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

const deleteBlogSettings = async (id: string) => {
  const { data: responseData } = await api.delete(`/blogsettingviewset/delete_blog_setting/${id}`, {});
  return responseData;
};

export const useDeleteBlogSettings = () => {
  const mutation = useMutation({
    mutationFn: deleteBlogSettings,
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

//wordpress keys apis

const getWordPressKeys = async (id?: string) => {
  const { data: responseData } = await api.get(`/wordpress/list_wordpress_settings/${id}`);
  return responseData;
};

export const useGetWordPressKeys = (id?: string) => {
  return useQuery({
    queryKey: [queryKeys.wordpress, id],
    queryFn: () => getWordPressKeys(id),
  });
};

const addWordPressKeys = async (request: WordPressKeys) => {
  const { data: responseData } = await api.post('/wordpress/add_wordpress_setting/', {
    ...request,
  });
  return responseData;
};

export const useAddWordPressKeys = () => {
  const mutation = useMutation({
    mutationFn: addWordPressKeys,
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

const editWordPressKeys = async (request: WordPressKeys) => {
  const { data: responseData } = await api.patch(`/wordpress/update_wordpress_setting/${request.id}/`, {
    ...request,
  });
  return responseData;
};

export const useEditWordPressKeys = () => {
  const mutation = useMutation({
    mutationFn: editWordPressKeys,
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

const deleteWordPressKeys = async (id: string) => {
  const { data: responseData } = await api.delete(`/wordpress/delete_wordpress_setting/${id}/`, {});
  return responseData;
};

export const useDeleteWordPressKeys = () => {
  const mutation = useMutation({
    mutationFn: deleteWordPressKeys,
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

const getUserParameters = async (id: string) => {
  const data = await api.get(`/userparameter/get_parameter?user_id=${id}`);
  return data.data;
};

export const useGetUserParameters = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.userParameters, id],
    queryFn: () => getUserParameters(id),
  });
};

const addUserParameters = async (data: IUserParametersPayload) => {
  const { data: responseData } = await api.patch('/userparameter/update_or_add_parameter/', {
    ...data,
  });
  return responseData;
};

export const useAddUserParameters = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addUserParameters,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.userParameters] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.blogTopics, variables.user_id.toString()] });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

const checkUserSubscription = async () => {
  const data = await api.get(`/stripe/check_subscription`);
  return data.data;
};

export const useCheckUserSubscription = () => {
  return useQuery({
    queryKey: [queryKeys.userSubscription],
    queryFn: checkUserSubscription,
  });
};

const getUserPlanDetails = async (id: string) => {
  const data = await api.get(`/subscription-plans/get_subscription_plan?user_id=${id}`);
  return data.data;
};

export const useGetUserPlanDetails = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.userPlanDetails, id],
    queryFn: () => getUserPlanDetails(id),
  });
};

const getUserPaymentHistory = async (id: string) => {
  const data = await api.get(`/payments/get_user_payment?user_id=${id}`);
  return data.data;
};

export const useGetUserPaymentHistory = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.userPaymentHistory, id],
    queryFn: () => getUserPaymentHistory(id),
  });
};

const getAdminsList = async () => {
  const data = await api.get(`/superadmin/admins/`);
  return data.data;
};

export const useGetAdminsList = () => {
  return useQuery({
    queryKey: [queryKeys.admins],
    queryFn: getAdminsList,
  });
};
