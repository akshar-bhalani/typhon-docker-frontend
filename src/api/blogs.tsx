import api from '@/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/reactQuery';
import { Blogs, PaginationSettings } from '@/types';
import { format } from 'date-fns';
import { TBlogTopicEditPayload, TBlogTopicResponse, TBlogTopicsListResponse } from '@/types/blogs';

const getAllBlogs = async (
  order: 'asc' | 'desc' = 'desc',
  limit: number = 10,
  page: number = 1,
  search: string = '',
  start_date?: Date,
  end_date?: Date
) => {
  const offset = (page - 1) * limit;

  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
    order,
  });

  if (search) params.append('search', search);
  if (start_date) {
    params.append('start_date', format(start_date, 'yyyy-MM-dd'));
    params.append('end_date', format(end_date ?? start_date, 'yyyy-MM-dd'));
  }

  const { data: responseData } = await api.get(`/blogs/list_blogs?${params.toString()}`);
  return responseData;
};

export const useGetAllBlogs = (
  pagination: PaginationSettings,
  searchTerm: string,
  start_date?: Date,
  end_date?: Date
) => {
  return useQuery({
    queryKey: [queryKeys.blogs, pagination, searchTerm, start_date, end_date],
    queryFn: () => getAllBlogs(pagination.order, pagination.limit, pagination.page, searchTerm, start_date, end_date),
  });
};

const getBlogById = async (id?: string) => {
  const { data: responseData } = await api.get(`blogs/get_blog_from_wordpress/${id}`);
  return responseData;
};

export const useGetBlogByID = (id?: string) => {
  return useQuery({
    queryKey: [queryKeys.blog, id],
    queryFn: () => getBlogById(id),
    enabled: !!id,
  });
};

const editBlog = async (request: Blogs) => {
  const { data: responseData } = await api.patch(`/blogs/update_blog_to_wordpress/${request.id}`, {
    ...request,
  });
  return responseData;
};

export const useEditBlog = () => {
  const mutation = useMutation({
    mutationFn: editBlog,
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

// Blog Topics API
const getBlogTopics = async (
  userId: string,
  pagination: PaginationSettings,
  startDate?: Date,
  endDate?: Date,
  searchTerm?: string
): Promise<TBlogTopicsListResponse> => {
  const offset = (pagination.page - 1) * pagination.limit;

  const params = new URLSearchParams({
    user_id: userId,
    limit: pagination.limit.toString(),
    offset: offset.toString(),
  });

  if (startDate) {
    params.append('start_date', format(startDate, 'yyyy-MM-dd'));
    params.append('end_date', format(endDate ?? startDate, 'yyyy-MM-dd'));
  }

  if (searchTerm) {
    params.append('search', searchTerm);
  }

  const { data: responseData } = await api.get(`/custom-blog-topics/list_topics/?${params.toString()}`);
  return responseData;
};

export const useGetBlogTopics = (
  userId: string,
  pagination: PaginationSettings,
  startDate?: Date,
  endDate?: Date,
  searchTerm?: string
) => {
  return useQuery({
    queryKey: [queryKeys.blogTopics, userId, pagination, startDate, endDate, searchTerm],
    queryFn: () => getBlogTopics(userId, pagination, startDate, endDate, searchTerm),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const addBlogTopic = async (request: TBlogTopicEditPayload): Promise<TBlogTopicResponse> => {
  const { data: responseData } = await api.post(`/custom-blog-topics/add_topic/`, request);
  return responseData;
};

export const useAddBlogTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBlogTopic,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.blogTopics, variables.user.toString()],
      });
    },
  });
};

const editBlogTopic = async (request: TBlogTopicEditPayload & { id: number }): Promise<TBlogTopicResponse> => {
  const { id, ...payload } = request;
  const { data: responseData } = await api.patch(`/custom-blog-topics/update/${id}`, payload);
  return responseData;
};

export const useEditBlogTopic = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editBlogTopic,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.blogTopics, variables.user.toString()],
      });
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

const deleteBlogTopic = async (id: number): Promise<{ message: string }> => {
  const { data: responseData } = await api.delete(`/custom-blog-topics/delete/${id}`);
  return responseData;
};

export const useDeleteBlogTopic = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteBlogTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.blogTopics],
      });
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

// Function to get topics for a specific date
const getTopicsByDate = async (userId: string, date: string): Promise<TBlogTopicsListResponse> => {
  const params = new URLSearchParams({
    user_id: userId,
    limit: '100', // Large limit to get all topics for this date
    offset: '0',
  });

  // Filter exactly by this date
  params.append('start_date', date);
  params.append('end_date', date);

  const { data: responseData } = await api.get(`/custom-blog-topics/list_topics/?${params.toString()}`);
  return responseData;
};

export const useGetTopicsByDate = (userId: string, date: string | undefined) => {
  return useQuery({
    queryKey: [queryKeys.blogTopicsByDate, userId, date],
    queryFn: () => getTopicsByDate(userId, date!),
    enabled: !!userId && !!date,
    staleTime: 1000 * 60, // 1 minute
  });
};
