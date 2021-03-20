import { getStats } from './getStats';
import { Transaction, Stats } from '../types';

describe('getStats', () => {
  test('should return global stats', () => {
    const input: Transaction[] = [
      {
        amount: -10,
        currency: 'USD',
        tag: 'food',
        createdAt: new Date(2021, 4, 19),
        description: 'cheese and milk',
      },
      {
        amount: -20,
        currency: 'USD',
        tag: 'car',
        createdAt: new Date(2021, 4, 13),
        description: 'fuel',
      },
      {
        amount: -500,
        currency: 'USD',
        tag: 'apartment',
        createdAt: new Date(2021, 4, 12),
      },
      {
        amount: 5000,
        currency: 'USD',
        tag: 'job',
        createdAt: new Date(2021, 4, 5),
      },
    ];

    const output: Stats = {
      transactions: {
        job: { totalIncome: 5000, totalExpenses: 0 },
        car: { totalIncome: 0, totalExpenses: 20 },
        food: { totalIncome: 0, totalExpenses: 10 },
        apartment: { totalIncome: 0, totalExpenses: 500 },
      },
      transactionSum: 5530,
      income: 5000,
      expenses: 530,
    };

    expect(getStats(input)).toEqual(output);
  });

  test.skip('should return stats for specific period of time', () => {});
});
