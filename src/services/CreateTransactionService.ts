import AppError from '../errors/AppError';

import { getCustomRepository, TransactionRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
	title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category}: Request): Promise<Transaction> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    let findCategory = await categoriesRepository.findOne(
      {
        where: {
          title: category
        }
      }      
    );

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

		if (!findCategory) {
      findCategory = await categoriesRepository.create({title: category});
      //throw new AppError('This appointment is already booked');

      await categoriesRepository.save(findCategory);
		}

   
    const transaction = transactionsRepository.create({
      title, 
      value, 
      type,
      category_id: findCategory.id, 
    });

    await transactionsRepository.save(transaction);

    return transaction;

  }
}

export default CreateTransactionService;
