import { Transaction } from 'src/types';

const DESCRIPTION_START = '[';
const DESCRIPTION_END = ']';

export const parseDescription = (description: string) => description.slice(1).slice(0, -1);

export const parseTransaction = (action: string): Transaction => {
  const [amount, currency, tag, ...rest] = action.split(' ');

  let expensesObject: Transaction = { amount: +amount, currency, tag };

  let description = '';

  const rawTag = rest[0];

  const isOneWordDescription =
    rawTag &&
    rawTag.includes(DESCRIPTION_START) &&
    rawTag.includes(DESCRIPTION_END) &&
    !rawTag.includes(' ');

  if (isOneWordDescription) {
    expensesObject.description = rawTag.slice(0, -1).slice(1);
  } else {
    rest.forEach((arg) => {
      if (arg.includes(DESCRIPTION_START)) {
        description += `${arg.slice(1)}`;
      } else if (arg.includes(DESCRIPTION_END)) {
        description += ` ${arg.slice(0, -1)}`;
      } else if (description) {
        description += ` ${arg}`;
      }
    });
  }

  if (description) {
    expensesObject.description = description;
  }

  return expensesObject;
};
