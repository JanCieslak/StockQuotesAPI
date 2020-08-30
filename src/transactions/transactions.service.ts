import { Injectable } from '@nestjs/common';
import { TransactionDto } from 'src/dtos/add-transation.dto';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { Connection } from 'typeorm';
import { CompanyEntity } from 'src/entities/company.entity';
import { validate } from 'class-validator';

@Injectable()
export class TransactionsService {
  constructor(private readonly connection: Connection) {}

  async addTransactions(transactionsDto: TransactionDto[]) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    const companyRepo = queryRunner.manager.getRepository(CompanyEntity);

    try {
      for (const transactionDto of transactionsDto) {
        // check if company exists
        let company = await companyRepo.findOne(transactionDto.company);

        // if not create a new one
        if (!company) {
          const newCompany = await queryRunner.manager.create(
            CompanyEntity,
            transactionDto.company,
          );

          await queryRunner.manager.save(newCompany);
        }

        company = await companyRepo.findOne(transactionDto.company);

        // create and save new transaction
        const newTransaction = await queryRunner.manager.create(
          TransactionEntity,
          {
            company: company,
            amount: transactionDto.amount,
          },
        );

        await queryRunner.manager.save(newTransaction);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
