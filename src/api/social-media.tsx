import api from '@/api';
import { format } from 'date-fns';
import { queryKeys } from '@/hooks/reactQuery';
import { PaginationSettings } from '@/types';
import {
  TAddSocialMediaPostPayload,
  TSocialMediaData,
  TSocialMediaPlatform,
  TSocialMediaStatisticsTimePeriod,
} from '@/types/social-media';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API response type
interface ISocialMediaApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TSocialMediaData[];
}

// type for social media count item
interface ISocialMediaCountItem {
  platform: string;
  post_count: number;
}

//  type for social media count response
interface ISocialMediaCountResponse {
  platform_counts: ISocialMediaCountItem[];
}

const getSocialMediaData = async (
  platform: TSocialMediaPlatform,
  order: 'asc' | 'desc' = 'desc',
  limit: number = 10,
  page: number = 1,
  search: string = '',
  start_date?: Date,
  end_date?: Date
): Promise<ISocialMediaApiResponse> => {
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

  const { data: responseData } = await api.get(`/socialmedia/list_posts/?platform=${platform}&${params.toString()}`);

  return responseData;
};

export const useGetSocialMediaData = (
  platform: TSocialMediaPlatform,
  pagination: PaginationSettings,
  searchTerm: string,
  start_date?: Date,
  end_date?: Date
) => {
  return useQuery<ISocialMediaApiResponse>({
    queryKey: [queryKeys.socialmedia, platform, pagination, searchTerm, start_date, end_date],
    queryFn: () =>
      getSocialMediaData(
        platform,
        pagination.order,
        pagination.limit,
        pagination.page,
        searchTerm,
        start_date,
        end_date
      ),
    enabled: !!platform,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const addSocialMediaData = async (data: TAddSocialMediaPostPayload) => {
  const { data: responseData } = await api.post('/socialmedia/add_post/', data);
  return responseData;
};

export const useAddSocialMediaData = () => {
  const queryClient = useQueryClient();

  return useMutation<TSocialMediaData, Error, TAddSocialMediaPostPayload>({
    mutationFn: addSocialMediaData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.socialmedia, data.platform],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.socialMediaCount],
      });
    },
  });
};

const editSocialMediaData = async (data: { id: number } & Partial<TAddSocialMediaPostPayload>) => {
  const { id, ...updateData } = data;
  const { data: responseData } = await api.patch(`/socialmedia/update_post/${id}`, updateData);
  return responseData;
};

export const useEditSocialMediaData = () => {
  const queryClient = useQueryClient();

  return useMutation<TSocialMediaData, Error, { id: number } & Partial<TAddSocialMediaPostPayload>>({
    mutationFn: editSocialMediaData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.socialmedia, data.platform],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.socialMediaCount],
      });
    },
  });
};

// const deleteSocialMediaPost = async (id: number) => {
//   const { data: responseData } = await api.delete(`/socialmedia/delete_post/${id}`);
//   return responseData;
// };

// export const useDeleteSocialMediaData = () => {
//   return useMutation<void, Error, number>({
//     mutationFn: deleteSocialMediaPost,
//   });
// };

const getSocialMediaCount = async (): Promise<ISocialMediaCountResponse> => {
  const { data: responseData } = await api.get(`/dashboard/social_media_post_count`);
  return responseData;
};

export const useGetSocialMediaCount = () => {
  return useQuery<ISocialMediaCountResponse, Error>({
    queryKey: [queryKeys.socialMediaCount],
    queryFn: getSocialMediaCount,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const getSocialMediaStatistics = async (
  platform: TSocialMediaPlatform,
  period: TSocialMediaStatisticsTimePeriod = 'this_week'
) => {
  const { data: responseData } = await api.get(
    `/socialmedia/social_media_statistics/?platform=${platform}&period=${period}`
  );
  return responseData;
};

export const useGetSocialMediaStatistics = (
  platform: TSocialMediaPlatform,
  period: TSocialMediaStatisticsTimePeriod = 'this_week'
) => {
  return useQuery({
    queryKey: [queryKeys.socialMediaStatistics, platform, period],
    queryFn: () => getSocialMediaStatistics(platform, period),
    enabled: !!platform,
  });
};
