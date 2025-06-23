// Valid platforms - maintain this list to match what's available in the dashboard
export const validPlatforms = ['linkedin', 'facebook', 'x', 'instagram'] as const;

// type for available social media platforms
export type TSocialMediaPlatform = (typeof validPlatforms)[number];

// Platform display names for UI rendering
export const platformDisplayNames: Record<TSocialMediaPlatform, string> = {
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  x: 'X',
  instagram: 'Instagram',
};

// TODO: change according to response
export type TSocialMediaData = {
  id: number;
  user_id: number;
  username: string;
  platform: TSocialMediaPlatform;
  platform_display: string;
  title: string;
  link: string;
  publish_date: string;
  created_at: string;
  updated_at: string;
};

export type TAddSocialMediaPostPayload = {
  title: string;
  platform: TSocialMediaPlatform;
  link: string;
  publish_date: string;
  user_id: number;
};

export const SocialMediaStatisticsTimePeriods = [
  'this_week',
  'last_week',
  'this_month',
  'last_month',
  'this_year',
] as const;

export type TSocialMediaStatisticsTimePeriod = (typeof SocialMediaStatisticsTimePeriods)[number];
