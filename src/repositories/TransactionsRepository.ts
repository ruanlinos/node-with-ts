import { response } from 'express';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions.filter(item => item.type === 'income');
    const outcome = this.transactions.filter(item => item.type === 'outcome');

    const totalIncome = income.reduce(
      (accumulator, transaction) => {
        const sum = accumulator.value + transaction.value;

        return {
          value: sum,
        };
      },
      { value: 0 }, // Initial Value <--
    );

    const totalOutcome = outcome.reduce(
      (accumulator, transaction) => {
        const sum = accumulator.value + transaction.value;

        return {
          value: sum,
        };
      },
      { value: 0 }, // Initial Value <--
    );
    const total = totalIncome.value - totalOutcome.value;
    return { income: totalIncome.value, outcome: totalOutcome.value, total };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, type, value });
    const balance = this.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw Error('you dont have enough balance');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
