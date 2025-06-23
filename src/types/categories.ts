export interface ISubcategory {
  id: number;
  name: string;
  category: number;
}

export interface ICategory {
  id: number;
  name: string;
  subcategories: ISubcategory[];
}

export interface IAddCategoryPayload {
  name: string;
  subcategories: string[];
}

// Updated to handle both existing and new subcategories
export interface ISubcategoryUpdatePayload {
  id: number | null; // null for new subcategories
  name: string;
}

export interface IUpdateCategoryWithSubcategoriesPayload {
  name: string;
  subcategories: ISubcategoryUpdatePayload[];
}
