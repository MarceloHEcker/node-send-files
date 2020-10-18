import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(transaction_id: string): Promise<void> {
    
      const transactionsRepository = getCustomRepository(TransactionsRepository);

      const findTransaction = await transactionsRepository.findOne(
        transaction_id
      );
    
      if (!findTransaction) {
        throw new AppError('Invalid transaction', 401);  
        //throw new AppError('This appointment is already booked');
		  }

      await transactionsRepository.remove(findTransaction);

  }
}

export default DeleteTransactionService;
