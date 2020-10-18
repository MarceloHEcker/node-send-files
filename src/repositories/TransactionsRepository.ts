import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {  
    // income - soma de todos os valores do tipo income
    const incomeAppointments = await this.find({
			where: { type: 'income' },
    });

    const reducedIncomeValue = incomeAppointments.reduce( (acc, actual) => acc + actual.value, 0);

    //outcome - soma de todos os valores do tipo outcome
    const outcomeAppointments = await this.find({
			where: { type: 'outcome' },
    });

    const reducedOutcomeValue = outcomeAppointments.reduce( (acc, actual) => acc + actual.value, 0);

    return {
      income: reducedIncomeValue,
      outcome: reducedOutcomeValue,
      total: reducedIncomeValue - reducedOutcomeValue,
    }
  }
}

export default TransactionsRepository;
