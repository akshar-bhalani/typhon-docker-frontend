export interface IPlan {
  id: number;
  name: string;
  description: string;
  price_per_month: string;
  currency: string;
  price_id: string;
  max_blogs_per_month: number;
  max_refresh_count: number;
  frequency: string;
  created_at: string;
  updated_at: string;
}

export interface ICheckoutSessionData {
  price_id: string;
  success_url: string;
  cancel_url: string;
}
