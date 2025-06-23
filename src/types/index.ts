export interface Subscriptions {
  id: string;
  name: string;
  description: string;
  price_per_month: string;
  max_blogs_per_month: string;
  max_refresh_count: string;
  frequency: string;
  created_at: string;
  updated_at: string;
}

export interface BlogsSettings {
  id: string;
  name: string;
  frequency_value?: 'daily' | 'weekly' | 'monthly';
  cycle_interval: number;
  created_at?: string;
  updated_at?: string;
  wordpress_id: string;
  user_id: string;
}

export interface WordPressKeys {
  id?: string;
  wordpress_api_key: string;
  wordpress_key_name: string;
  wordpress_username: string;
  wordpress_url: string;
  user_id: string;
}

export interface IUserParametersPayload {
  user_id: number;
  number_of_posts: number;
  word_count: number;
  subcategories: number[];
}

export interface Users {
  id?: string;
  name: string;
  role: string;
  email: string;
  company_name?: string;
  phone?: number;
  status?: string;
}

export interface Blogs {
  id: string;
  title: string;
  link: string;
  publish_date: string;
  refresh_count: string;
  created_at?: string;
  user_id?: string;
  setting_id: string;
}

export enum Role {
  Admin = 'Admin',
  User = 'User',
  SuperAdmin = 'SuperAdmin',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export type PaginationSettings = {
  page: number;
  order: 'asc' | 'desc';
  limit: number;
  total: number;
};
