import { Transaction } from '../types';
import { parseTransaction } from './parseTransaction';

describe('parseTransaction', () => {
  test('should return data structure based on simple action string (expenses)', () => {
    const input = '-10 USD food';

    const output: Transaction = {
      amount: -10,
      currency: 'USD',
      tag: 'food',
    };

    expect(parseTransaction(input)).toEqual(output);
  });

  test('should return data structure based on simple action string (income)', () => {
    const input = '+10000 USD salary';

    const output: Transaction = {
      amount: 10000,
      currency: 'USD',
      tag: 'salary',
    };

    expect(parseTransaction(input)).toEqual(output);
  });

  test('should return data structure based on complex action string (income)', () => {
    const input = '+10000 USD salary [freelance, design]';

    const output: Transaction = {
      amount: 10000,
      currency: 'USD',
      tag: 'salary',
      description: 'freelance, design',
    };

    expect(parseTransaction(input)).toEqual(output);
  });

  test('should return data structure based on complex action string', () => {
    const input = '-10 USD food [cheese, and, fish]';

    const output: Transaction = {
      amount: -10,
      currency: 'USD',
      tag: 'food',
      description: 'cheese, and, fish',
    };

    expect(parseTransaction(input)).toEqual(output);
  });

  test('should return data structure based on simple action string', () => {
    const input = '-10 USD food [fish]';

    const output: Transaction = {
      amount: -10,
      currency: 'USD',
      tag: 'food',
      description: 'fish',
    };

    expect(parseTransaction(input)).toEqual(output);
  });

  test('should return data structure based on simple action string with characters', () => {
    const input = '-10 USD food [[!fish!]]';

    const output: Transaction = {
      amount: -10,
      currency: 'USD',
      tag: 'food',
      description: '[!fish!]',
    };

    expect(parseTransaction(input)).toEqual(output);
  });
});
