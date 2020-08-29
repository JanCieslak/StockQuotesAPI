import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { TransactionsDto } from 'src/dtos/add-transation.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async addTransactions(@Body(ValidationPipe) transactions: TransactionsDto) {
    await this.transactionsService.addTransactions(transactions);
  }
}
