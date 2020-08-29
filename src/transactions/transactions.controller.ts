import { Controller, Post, Body } from '@nestjs/common';
import { TransactionDto } from 'src/dtos/add-transation.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async addTransactions(@Body() transactions: TransactionDto[]) {
    await this.transactionsService.addTransactions(transactions);
  }
}
