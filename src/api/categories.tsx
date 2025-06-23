import api from '@/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/reactQuery';
import { ICategory, IAddCategoryPayload, IUpdateCategoryWithSubcategoriesPayload } from '@/types/categories';

// Get all categories with subcategories
const getAllCategories = async (): Promise<ICategory[]> => {
  const { data } = await api.get('/categories/all_categories_with_subcategories/');
  return data;
};

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: [queryKeys.categories],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

// Add new category with subcategories
const addCategoryWithSubcategories = async (payload: IAddCategoryPayload) => {
  const { data } = await api.post('/categories/add_category_with_subcategories/', payload);
  return data;
};

export const useAddCategoryWithSubcategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCategoryWithSubcategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.categories] });
    },
  });
};

// Update category with subcategories
const updateCategoryWithSubcategories = async ({
  payload,
  categoryId,
}: {
  payload: IUpdateCategoryWithSubcategoriesPayload;
  categoryId: number;
}) => {
  // Create a formatted payload that removes id field from new subcategories
  const formattedPayload = {
    name: payload.name,
    subcategories: payload.subcategories.map((sub) => {
      // For existing subcategories, keep the id
      if (sub.id !== null) {
        return {
          id: sub.id,
          name: sub.name,
        };
      }
      // For new subcategories, don't include the id field at all
      return {
        name: sub.name,
      };
    }),
  };

  const { data } = await api.patch(`/categories/update_category_with_subcategories/${categoryId}/`, formattedPayload);
  return data;
};

export const useUpdateCategoryWithSubcategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategoryWithSubcategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.categories] });
    },
  });
};
