import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  ParseArrayPipe,
} from '@nestjs/common';
// import { TransactionsDto } from 'src/dtos/add-transation.dto';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from '../dtos/add-transation.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async addTransactions(
    @Body(new ParseArrayPipe({ items: TransactionDto }))
    transactions: TransactionDto[],
  ) {
    await this.transactionsService.addTransactions(transactions);
  }
}
