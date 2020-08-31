import { Test, TestingModule } from '@nestjs/testing';
import { CompanyEntity } from '../entities/company.entity';
import { TransactionEntity } from '../entities/transaction.entity';
import { Connection, createConnection, Repository } from 'typeorm';
import { TransactionsService } from './transactions.service';

const mockConnection = async () => {
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

describe('TransactionsService', () => {
  let service: TransactionsService;
  let connection: Connection;
  let companyRepo: Repository<CompanyEntity>;
  let transactionRepo: Repository<TransactionEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: Connection,
          useFactory: mockConnection,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    connection = module.get<Connection>(Connection);

    companyRepo = connection.getRepository(CompanyEntity);
    transactionRepo = connection.getRepository(TransactionEntity);
  });

  beforeEach(async () => {
    await connection
      .createQueryBuilder()
      .delete()
      .from(CompanyEntity)
      .where('TRUE')
      .execute();

    await connection
      .createQueryBuilder()
      .delete()
      .from(TransactionEntity)
      .where('TRUE')
      .execute();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add valid transaction to the database', async () => {
    const companyName = 'TEST_COMPANY_NAME';
    const companySymbol = 'TEST_COMPANY_SYMBOL';

    const validRequest = `[ { "company": { "name": "${companyName}", "symbol": "${companySymbol}" }, "amount": 2200 } ]`;

    const falsyResult = await companyRepo.findOne({
      name: companyName,
      symbol: companySymbol,
    });
    expect(falsyResult).toBeFalsy();

    await service.addTransactions(JSON.parse(validRequest));

    const truthlyResult = await companyRepo.findOne({
      name: companyName,
      symbol: companySymbol,
    });
    expect(truthlyResult).toBeTruthy();
  });

  it('should handle concurrent requests', () => {
    
  });
});
