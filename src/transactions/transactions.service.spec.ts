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
    const validRequest: CompanyDto[] = [
      {
        name: companyName,
        symbol: companySymbol,
        transactions: [
          {
            amount: 2000,
            date: new Date(2020, 4, 22),
          },
          {
            amount: 2200,
            date: new Date(2018, 6, 25),
          },
        ],
      },
    ];

    const falsyResult = await companyRepo.findOne({
      name: companyName,
      symbol: companySymbol,
    });
    expect(falsyResult).toBeFalsy();

    await service.addTransactions(validRequest);

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

  it('should handle concurrent requests', async () => {
    const alpha = alphavantage({ key: process.env.alpha_vintage_key });

    const companySymbols = ['TSLA', 'AMZN'];
    const companyDtos: CompanyDto[] = await createCompanies(
      companySymbols,
      alpha,
    );

    await service.addTransactions(companyDtos);
    await service.addTransactions(companyDtos);

    for (const companyDto of companyDtos) {
      const companyEntity = await companyRepo.findOne(
        {
          name: companyDto.name,
          symbol: companyDto.symbol,
        },
        { relations: ['transactions'] },
      );

      expect(companyEntity).toBeTruthy();
      expect(companyEntity.transactions.length).toBe(200);
    }
  });

  /**
   * @param symbols array of symbols to downolad specific company's stock quotes,
   * (max 5 requests per minute [this function uses symbols.length requests])
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
          amount: data[date]['4. close'],
          date: new Date(date),
        });
      }

      companies.push({
        name: await stocks.lookup(symbol),
        symbol: symbol,
        transactions: transactions,
      });
    }
    return companies;
  }
});
