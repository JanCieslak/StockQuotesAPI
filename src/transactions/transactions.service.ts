import { Injectable } from '@nestjs/common';
import { TransactionDto } from 'src/dtos/add-transation.dto';

@Injectable()
export class TransactionsService {
  async addTransactions(transactions: TransactionDto[]) {
    console.log(transactions);
  }
}
