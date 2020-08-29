import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { TransactionDto } from './dtos/add-transation.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async addTransactions(@Body() transactions: TransactionDto[]) {
    await this.appService.addTransactions(transactions);
  }
}
