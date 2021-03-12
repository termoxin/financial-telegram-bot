export interface Transaction {
  amount: number;
  currency: string;
  tag: string;
  description?: string;
}
