import api from '@/api';
import { Role } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/reactQuery';
import { TBlogStatisticTimePeriod } from '@/types/blogs';

const getTotalUserCount = async () => {
  const data = await api.get(`/dashboard/user_count/`);
  return data.data;
};

export const useGetTotalUserCount = (userRole: Role) => {
  return useQuery({
    queryKey: [queryKeys.totalUsersCount],
    queryFn: getTotalUserCount,
    enabled: userRole === Role.SuperAdmin || userRole === Role.Admin,
  });
};

const getTotalBlogCount = async () => {
  const data = await api.get(`/dashboard/blog_count/`);
  return data.data;
};

export const useGetTotalBlogCount = () => {
  return useQuery({
    queryKey: [queryKeys.totalBlogsCount],
    queryFn: getTotalBlogCount,
  });
};

const getBlogStatistics = async (period: TBlogStatisticTimePeriod) => {
  const { data: responseData } = await api.get('/blogs/blog_statistics/?period=' + period);
  return responseData;
};

export const useGetBlogStatistics = (period: TBlogStatisticTimePeriod) => {
  return useQuery({
    queryKey: [queryKeys.blogStatistics, period],
    queryFn: () => getBlogStatistics(period),
  });
};
