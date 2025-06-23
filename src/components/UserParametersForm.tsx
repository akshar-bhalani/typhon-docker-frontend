import { useGetAllCategories } from '@/api/categories';
import { IUserParametersPayload } from '@/types/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import MultiSelect from './ui/multiselect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AddCategoryModal } from './categories/AddCategoryModal';
import { ICategory } from '@/types/categories';
import { z } from 'zod';

export const userParametersFormSchema = z.object({
  number_of_posts: z.coerce.number().min(1, {
    message: 'Number of posts is required.',
  }),
  word_count: z.coerce.number().min(1, {
    message: 'Word count is required.',
  }),
  categories: z.array(z.number()).min(1, { message: 'At least one category is required.' }),
  subcategories: z.array(z.number()).min(1, { message: 'At least one subcategory is required.' }),
});

export type UserParametersFormValues = z.infer<typeof userParametersFormSchema>;

export function UserParametersForm({
  initialData,
  user_id,
  onSubmit,
}: {
  initialData: UserParametersFormValues | null;
  user_id: string;
  onSubmit: (data: IUserParametersPayload) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategories();

  const form = useForm<UserParametersFormValues>({
    resolver: zodResolver(userParametersFormSchema),
    defaultValues: {
      ...(initialData || {
        number_of_posts: 0,
        word_count: 0,
      }),
      categories: initialData?.categories || [],
      subcategories: initialData?.subcategories || [],
    },
  });

  const subcategories = useMemo(() => {
    if (!selectedCategory || !categoriesData) return [];
    const category = categoriesData.find((cat: ICategory) => cat.id === selectedCategory);
    return category?.subcategories || [];
  }, [selectedCategory, categoriesData]);

  const handleCategoryChange = (categoryId: string) => {
    const numericId = parseInt(categoryId, 10);
    setSelectedCategory(numericId);
    form.setValue('categories', [numericId], {
      shouldDirty: true,
    });
    form.setValue('subcategories', [], {
      shouldDirty: true,
    });
  };

  function handleSubmit(values: UserParametersFormValues) {
    setIsLoading(true);
    try {
      onSubmit({ ...values, user_id: parseInt(user_id, 10) });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    form.reset(
      initialData || {
        number_of_posts: undefined,
        word_count: undefined,
        categories: [],
        subcategories: [],
      }
    );
    if (initialData?.categories) {
      setSelectedCategory(initialData.categories[0]);
    } else {
      setSelectedCategory(null);
    }
  };

  useEffect(() => {
    form.reset({
      ...initialData,
      subcategories: initialData?.subcategories || [],
    });

    if (initialData?.categories) {
      setSelectedCategory(initialData.categories[0]);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <AddCategoryModal isOpen={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen} />
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-4 lg:w-1/3">
        <FormField
          control={form.control}
          name="number_of_posts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Posts</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter number of posts" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="word_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Word Count</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter word count" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Category</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCategoryDialogOpen(true)}
                  className="text-xs"
                >
                  Add New
                </Button>
              </div>
              <Select onValueChange={handleCategoryChange} value={field.value?.toString()} disabled={categoriesLoading}>
                <FormControl>
                  <SelectTrigger>
                    {categoriesLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Loading categories...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Select category" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoriesData?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subcategories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategories</FormLabel>
              <FormControl>
                <MultiSelect
                  options={subcategories.map((sub) => ({
                    label: sub.name,
                    value: sub.id.toString(),
                  }))}
                  value={field.value?.map((id) => id.toString())}
                  onChange={(selectedValues) => {
                    const numericValues = selectedValues.map((v) => parseInt(v, 10));
                    field.onChange(numericValues);
                  }}
                  isDisabled={!selectedCategory || selectedCategory <= 0 || subcategories.length === 0}
                  placeholder={
                    selectedCategory && selectedCategory > 0 ? 'Select subcategories' : 'Select a category first'
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isDirty}
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Parameters'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading || !form.formState.isDirty}
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
