// export const BlogStatisticTimePeriods = ['this_week', 'last_week',  'this_month', 'last_month', 'this_year', 'last_year'] as const;

export const BlogStatisticTimePeriods = ['this_week', 'last_week', 'this_month', 'last_month', 'this_year'] as const;

export type TBlogStatisticTimePeriod = (typeof BlogStatisticTimePeriods)[number];

export type TBlogTopicsResponse = {
  id: string;
  topic: string;
  category: string;
  date: string;
};

export type TBlogCategory = {
  id: number;
  name: string;
};

export type TBlogSubcategory = {
  id: number;
  name: string;
  category: number;
};

export type TBlogTopicResponse = {
  id: number;
  user: number;
  title: string;
  usage_date: string;
  primary_keyword: string;
  secondary_keyword?: string;
  created_at: string;
  updated_at: string;
};

export type TBlogTopicEditPayload = {
  user: number;
  title: string;
  usage_date: string;
  primary_keyword: string;
  secondary_keyword?: string;
};

// Types for new custom blog topics API
export type TCustomBlogTopic = {
  id?: number;
  user: number;
  title: string;
  usage_date: string;
  description: string;
  created_at?: string;
  updated_at?: string;
};

export type TCustomBlogTopicResponse = {
  id: number;
  user: number;
  title: string;
  usage_date: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type TBlogTopicsListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TBlogTopicResponse[];
};
