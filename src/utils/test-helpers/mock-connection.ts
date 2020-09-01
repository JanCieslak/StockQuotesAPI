import { CompanyEntity } from '../../entities/company.entity';
import { TransactionEntity } from '../../entities/transaction.entity';
import { Connection, createConnection } from 'typeorm';

export const mockConnection = async () => {
  return await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: process.env.password,
    database: 'MockStockQuotesDb',
    entities: [CompanyEntity, TransactionEntity],
    synchronize: true,
  });
};