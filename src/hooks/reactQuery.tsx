import { useQueryClient } from '@tanstack/react-query';

export const useInvalidation = (queryKey) => {
  const queryClient = useQueryClient();

  const handleInvalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };
  return { handleInvalidate };
};

export const queryKeys = {
  user: 'user',
  profile: 'profile',
  users: 'users',
  subscription: 'SubscriptionPlans',
  blogSettings: 'blog_setting',
  wordpress: 'wordpress',
  blogs: 'blogs',
  blog: 'blog',
  userParameters: 'userParameters',
  userPlanDetails: 'userPlanDetails',
  userPaymentHistory: 'userPaymentHistory',
  userSubscription: 'userSubscription',
  admins: 'admins',
  blogStatistics: 'blogStatistics',
  totalUsersCount: 'totalUsersCount',
  totalBlogsCount: 'totalBlogsCount',
  socialmedia: 'socialmedia',
  allActiveUsers: 'allActiveUsers',
  socialMediaCount: 'socialMediaCount',
  socialMediaStatistics: 'socialMediaStatistics',
  categories: 'categories',
  blogTopics: 'blogTopics',
  blogTopicsCustom: 'blogTopicsCustom',
  customBlogTopics: 'customBlogTopics',
  customBlogTopic: 'customBlogTopic',
  blogTopicsByDate: 'blogTopicsByDate',
  userReviews: 'userReviews',
};
