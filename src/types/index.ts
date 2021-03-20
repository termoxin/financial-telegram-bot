export interface Transaction {
  amount: number;
  currency: string;
  tag: string;
  description?: string;
  createdAt?: Date;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
}

export interface Stats {
  transactions: Record<string, TransactionStats>;
  transactionSum: number;
  income: number;
  expenses: number;
}
