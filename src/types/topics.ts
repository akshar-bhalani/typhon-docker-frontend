export type TManualTopic = {
  title: string;
  usage_date: string; // Format: YYYY-MM-DD
  description?: string;
};

export type TManualTopicResponse = {
  id: number;
  title: string;
  usage_date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};
