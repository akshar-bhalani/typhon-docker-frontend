import api from '@/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/reactQuery';
import { TUserReviewResponse } from '@/types/user-reviews';

// Get all reviews for a user
const getUserReviews = async (userId: string): Promise<TUserReviewResponse[]> => {
  const { data: responseData } = await api.get(`/reviews/list_reviews/?user_id=${userId}`);
  return responseData;
};

export const useGetUserReviews = (userId: string) => {
  return useQuery({
    queryKey: [queryKeys.userReviews, userId],
    queryFn: () => getUserReviews(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Download sample CSV
const downloadSampleCSV = async () => {
  const response = await api.get('/reviews/download_sample_csv/', {
    responseType: 'blob',
  });

  // Create a URL for the blob
  const url = window.URL.createObjectURL(new Blob([response.data]));

  // Create a temporary anchor element and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'sample_reviews.csv');
  document.body.appendChild(link);
  link.click();

  // Clean up
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);

  return true;
};

export const useDownloadSampleCSV = () => {
  return useMutation({
    mutationFn: downloadSampleCSV,
  });
};

// Upload CSV file
const uploadCSV = async (formData: FormData) => {
  const { data: responseData } = await api.post('/reviews/upload_csv/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return responseData;
};

export const useUploadReviewsCSV = () => {
  return useMutation({
    mutationFn: uploadCSV,
  });
};
