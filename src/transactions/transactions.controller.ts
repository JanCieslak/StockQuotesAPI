import { Controller, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CompanyDto } from '../dtos/add-transation.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiResponse({
    status: 201,
    description: 'Transactions added to the database',
  })
  @ApiBody({ type: [CompanyDto] })
  @Post()
  async addTransactions(
    @Body()
    companysTransactions: CompanyDto[],
  ) {
    await this.transactionsService.addTransactions(companysTransactions);
  }
}
