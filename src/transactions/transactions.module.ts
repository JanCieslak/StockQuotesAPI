import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from '../entities/company.entity';
import { TransactionEntity } from '../entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, CompanyEntity])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
