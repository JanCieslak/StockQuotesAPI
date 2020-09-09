import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyEntity } from '../entities/company.entity';
import { TransactionEntity } from '../entities/transaction.entity';
import { Connection, Repository } from 'typeorm';
import { TransactionsService } from './transactions.service';
import * as alphavantage from 'alphavantage';
import * as stocks from 'stock-ticker-symbol';
import { CompanyDto, TransactionDto } from '../dtos/add-transation.dto';
import { mockConnection } from '../utils/test-helpers/mock-connection';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let connection: Connection;
  let companyRepo: Repository<CompanyEntity>;
  let transactionRepo: Repository<TransactionEntity>;

  const companyName = 'TEST_COMPANY_NAME';
  const companySymbol = 'TEST_COMPANY_SYMBOL';
  const companyDto: CompanyDto[] = [
    {
      name: companyName,
      symbol: companySymbol,
      transactions: [
        {
          value: 2000,
          date: new Date(2020, 4, 22),
        },
        {
          value: 2200,
          date: new Date(2018, 6, 25),
        },
      ],
    },
  ];

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
    const falsyResult = await companyRepo.findOne({
      name: companyName,
      symbol: companySymbol,
    });
    expect(falsyResult).toBeFalsy();

    await service.addTransactions(companyDto);

    const truthlyResult = await companyRepo.findOne(
      {
        name: companyName,
        symbol: companySymbol,
      },
      { relations: ['transactions'] },
    );
    expect(truthlyResult).toBeTruthy();
    expect(truthlyResult.transactions.length).toBe(2);
  });

  it('should detect transaction collisions', async () => {
    const queryRunner1 = connection.createQueryRunner();
    await queryRunner1.connect();
    await queryRunner1.startTransaction('SERIALIZABLE');

    const queryRunner2 = connection.createQueryRunner();
    await queryRunner2.connect();
    await queryRunner2.startTransaction('SERIALIZABLE');

    let shouldThrowError = false;

    // transaction collision
    let results;
    try {
      results = await Promise.all([
        service.tryAddTransactions(queryRunner1, companyDto),
        service.tryAddTransactions(queryRunner2, companyDto),
      ]);
      await queryRunner1.commitTransaction();
      await queryRunner2.commitTransaction();
    } catch (err) {
      if (err.toString().includes('could not serialize access')) {
        shouldThrowError = true;
      }
    } finally {
      expect(shouldThrowError).toBeTruthy();
      await queryRunner1.release();
      await queryRunner2.release();
    }
  });

  it('should handle transaction collisions', async () => {
    await Promise.all([
      service.addTransactions(companyDto),
      service.addTransactions(companyDto),
    ]);

    const companyEntity = await companyRepo.findOne(
      {
        name: companyDto[0].name,
        symbol: companyDto[0].symbol,
      },
      { relations: ['transactions'] },
    );

    expect(companyEntity.transactions.length).toBe(4);
  });

  /**
   * @param symbols array of symbols to download specific company's stock quotes,
   * (max 5 requests per minute [this function uses symbols.length api requests])
   *
   * Downloads stock quotes from alphavantage api
   */
  async function createCompanies(symbols: string[], alpha: any) {
    const companies: CompanyDto[] = [];
    for (const symbol of symbols) {
      const data = (await alpha.data.intraday(symbol, 'compact'))[
        'Time Series (1min)'
      ];

      const transactions: TransactionDto[] = [];
      for (const date of Object.keys(data)) {
        transactions.push({
          value: data[date]['4. close'],
          date: new Date(date),
        });
      }

      companies.push({
        name: stocks.lookup(symbol),
        symbol: symbol,
        transactions: transactions,
      });
    }
    return companies;
  }
});
