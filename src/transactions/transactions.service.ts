import { Injectable } from '@nestjs/common';
import { CompanyDto } from '../dtos/add-transation.dto';
import { Connection } from 'typeorm';
import { CompanyEntity } from '../entities/company.entity';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(private readonly connection: Connection) {}

  async addTransactions(companyDtos: CompanyDto[]) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    const companyRepo = queryRunner.manager.getRepository(CompanyEntity);

    try {
      for (const companyDto of companyDtos) {
        const { transactions, ...companySearch } = companyDto;

        // check if company exists
        let company = await companyRepo.findOne(companySearch);

        // if not create a new one
        if (!company) {
          const newCompany = await queryRunner.manager.create(
            CompanyEntity,
            companyDto,
          );

          await queryRunner.manager.save(newCompany);
        }

        company = await companyRepo.findOne(companySearch);

        for (const transactionDto of companyDto.transactions) {
          // create and save new transaction
          const newTransaction = await queryRunner.manager.create(
            TransactionEntity,
            {
              company: company,
              value: transactionDto.value,
              date: transactionDto.date,
            },
          );

          await queryRunner.manager.save(newTransaction);
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      // console.error(err.toString());

      if (err.toString().includes('could not serialize access')) {
        await this.addTransactions(companyDtos);
      }

      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
