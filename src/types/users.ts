export interface IUserPaymentHistory {
  id: number;
  user_id: number;
  amount: string;
  payment_date: string;
  payment_method: string;
  plan_id: number;
  payment_status: string;
}

export type UserPaymentHistoryData = IUserPaymentHistory[];
