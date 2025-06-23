import { useState, useEffect } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import {
  useGetAllCategories,
  useAddCategoryWithSubcategories,
  useUpdateCategoryWithSubcategories,
} from '@/api/categories';
import { ICategory, IAddCategoryPayload, IUpdateCategoryWithSubcategoriesPayload } from '@/types/categories';

interface AddCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categoryToEdit?: ICategory;
}

interface SubcategoryFormItem {
  id: number | null; // null for new items
  name: string;
}

export function AddCategoryModal({ isOpen, onOpenChange, categoryToEdit }: AddCategoryModalProps) {
  const [newCategory, setNewCategory] = useState('');
  const [subcategories, setSubcategories] = useState<SubcategoryFormItem[]>([{ id: null, name: '' }]);
  const [existingCategoryId, setExistingCategoryId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'new-category' | 'add-subcategory'>('new-category');

  const { data: categoriesData = [] } = useGetAllCategories();
  const { mutate: addCategoryWithSubcategories, isPending: addingCategory } = useAddCategoryWithSubcategories();
  const { mutate: updateCategory, isPending: updatingCategory } = useUpdateCategoryWithSubcategories();

  const isEditing = Boolean(categoryToEdit);
  const isPending = addingCategory || updatingCategory;

  // Initialize form with category data when editing
  useEffect(() => {
    if (isOpen && categoryToEdit) {
      setNewCategory(categoryToEdit.name);
      setActiveTab('new-category');

      const existingSubcategories = categoryToEdit.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
      }));
      setSubcategories(existingSubcategories.length ? existingSubcategories : [{ id: null, name: '' }]);
    } else if (isOpen) {
      resetForm();
    }
  }, [categoryToEdit, isOpen]);

  // Load subcategories when a category is selected
  useEffect(() => {
    if (existingCategoryId && !isEditing && activeTab === 'add-subcategory') {
      const selectedCategory = categoriesData?.find((cat) => cat.id === parseInt(existingCategoryId, 10));

      if (selectedCategory) {
        const existingSubcategories = selectedCategory.subcategories.map((sub) => ({
          id: sub.id,
          name: sub.name,
        }));
        setSubcategories([...existingSubcategories, { id: null, name: '' }]);
      }
    }
  }, [existingCategoryId, categoriesData, isEditing, activeTab]);

  useEffect(() => {
    if (activeTab === 'new-category' && !isEditing) {
      setSubcategories([{ id: null, name: '' }]);
    }
  }, [activeTab, isEditing]);

  const resetForm = () => {
    setNewCategory('');
    setSubcategories([{ id: null, name: '' }]);
    setExistingCategoryId('');
    setActiveTab('new-category');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const addSubcategoryField = () => {
    setSubcategories([...subcategories, { id: null, name: '' }]);
  };

  const removeSubcategoryField = (index: number) => {
    const updated = [...subcategories];
    updated.splice(index, 1);
    setSubcategories(updated);
  };

  const updateSubcategory = (index: number, value: string) => {
    const updated = [...subcategories];
    updated[index].name = value;
    setSubcategories(updated);
  };

  const handleSubmit = (isNewCategory: boolean) => {
    // Filter empty subcategories
    const filteredSubcategories = subcategories.filter((s) => s.name.trim() !== '');

    if (filteredSubcategories.length === 0) {
      toast({
        title: 'Missing subcategories',
        description: 'Please add at least one subcategory',
        variant: 'destructive',
      });
      return;
    }

    if (isEditing && isNewCategory) {
      // Update existing category
      if (!newCategory.trim()) {
        toast({
          title: 'Missing category name',
          description: 'Please enter a category name',
          variant: 'destructive',
        });
        return;
      }

      const payload: IUpdateCategoryWithSubcategoriesPayload = {
        name: newCategory,
        subcategories: filteredSubcategories,
      };

      updateCategory(
        { payload, categoryId: categoryToEdit!.id },
        {
          onSuccess: () => {
            toast({
              title: 'Category updated',
              description: 'Category and subcategories updated successfully',
            });
            handleClose();
          },
          onError: (error) => {
            console.error('Update error:', error);
            toast({
              title: 'Error',
              description: 'Failed to update category',
              variant: 'destructive',
            });
          },
        }
      );
    } else if (isNewCategory) {
      // Adding a new category with subcategories
      if (!newCategory.trim()) {
        toast({
          title: 'Missing category name',
          description: 'Please enter a category name',
          variant: 'destructive',
        });
        return;
      }

      const payload: IAddCategoryPayload = {
        name: newCategory,
        subcategories: filteredSubcategories.map((sub) => sub.name),
      };

      addCategoryWithSubcategories(payload, {
        onSuccess: () => {
          toast({
            title: 'Category added',
            description: 'Category and subcategories added successfully',
          });
          handleClose();
        },
        onError: (error) => {
          console.error('Add error:', error);
          toast({
            title: 'Error',
            description: 'Failed to add category',
            variant: 'destructive',
          });
        },
      });
    } else {
      // Adding or updating subcategories to existing category
      if (!existingCategoryId) {
        toast({
          title: 'No category selected',
          description: 'Please select a category',
          variant: 'destructive',
        });
        return;
      }

      // Get the selected category to preserve its name
      const selectedCategory = categoriesData?.find((cat) => cat.id === parseInt(existingCategoryId, 10));

      if (!selectedCategory) {
        toast({
          title: 'Error',
          description: 'Selected category not found',
          variant: 'destructive',
        });
        return;
      }

      const payload: IUpdateCategoryWithSubcategoriesPayload = {
        name: selectedCategory.name,
        subcategories: filteredSubcategories,
      };

      updateCategory(
        { payload, categoryId: parseInt(existingCategoryId, 10) },
        {
          onSuccess: () => {
            toast({
              title: 'Subcategories updated',
              description: 'Successfully updated subcategories',
            });
            handleClose();
          },
          onError: (error) => {
            console.error('Update subcategories error:', error);
            toast({
              title: 'Error',
              description: 'Failed to update subcategories',
              variant: 'destructive',
            });
          },
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Category' : 'Add Categories & Subcategories'}</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="new-category"
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as 'new-category' | 'add-subcategory')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-category">{isEditing ? 'Edit Category' : 'New Category'}</TabsTrigger>
            <TabsTrigger value="add-subcategory" disabled={isEditing}>
              Add to Existing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new-category" className="mt-4 space-y-4">
            <div className="space-y-2">
              <FormLabel>Category Name</FormLabel>
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Subcategories</FormLabel>
                <Button type="button" size="sm" variant="outline" onClick={addSubcategoryField}>
                  <Plus className="mr-1 h-4 w-4" /> Add More
                </Button>
              </div>

              {subcategories.map((sub, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={sub.name}
                    onChange={(e) => updateSubcategory(index, e.target.value)}
                    placeholder={`Subcategory ${index + 1}`}
                  />
                  {subcategories.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSubcategoryField(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button onClick={() => handleSubmit(true)} disabled={!newCategory.trim() || isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isEditing ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="add-subcategory" className="mt-4 space-y-4">
            <div className="space-y-2">
              <FormLabel>Select Category</FormLabel>
              <Select onValueChange={(value) => setExistingCategoryId(value)} value={existingCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesData?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {existingCategoryId && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel>Subcategories</FormLabel>
                  <Button type="button" size="sm" variant="outline" onClick={addSubcategoryField}>
                    <Plus className="mr-1 h-4 w-4" /> Add More
                  </Button>
                </div>

                {subcategories.map((sub, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={sub.name}
                      onChange={(e) => updateSubcategory(index, e.target.value)}
                      placeholder={`${sub.id ? 'Edit existing' : 'New'} subcategory`}
                      className={sub.id ? 'border-green-200' : 'border-blue-200'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSubcategoryField(index)}
                      disabled={subcategories.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {/* Add a visual indicator for users to understand how to add new subcategories */}
                {!subcategories.some((sub) => sub.id === null) && (
                  <div className="mt-2 text-sm text-muted-foreground">Click "Add More" to add new subcategories</div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => handleSubmit(false)} disabled={!existingCategoryId || isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
