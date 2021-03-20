import { Transaction, TransactionStats } from 'src/types';

export const getStats = (transactions: Transaction[]) => {
  const transactionsCategories = transactions.reduce(
    (transactionStats: Record<string, TransactionStats>, transaction) => {
      const currentTransaction = transactionStats[transaction.tag];

      if (currentTransaction) {
        if (transaction.amount > 0) {
          currentTransaction.totalIncome += Math.abs(transaction.amount);
        } else {
          currentTransaction.totalExpenses += Math.abs(transaction.amount);
        }
      } else {
        transactionStats[transaction.tag] = { totalIncome: 0, totalExpenses: 0 };

        const category = transactionStats[transaction.tag];

        if (category) {
          if (transaction.amount > 0) {
            category.totalIncome += Math.abs(transaction.amount);
          } else {
            category.totalExpenses += Math.abs(transaction.amount);
          }
        }
      }

      return transactionStats;
    },
    {}
  );

  const transactionsCategoriesValues = Object.values(transactionsCategories);

  const income = transactionsCategoriesValues.length
    ? transactionsCategoriesValues
        .map((category) => category.totalIncome)
        .reduce((sum, income) => sum + income)
    : 0;

  const expenses = transactionsCategoriesValues.length
    ? transactionsCategoriesValues
        .map((category) => category.totalExpenses)
        .reduce((sum, expense) => sum + expense)
    : 0;

  return {
    transactions: transactionsCategories,
    transactionSum: income + expenses,
    income,
    expenses,
  };
};
