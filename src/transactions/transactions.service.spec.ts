import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyEntity } from '../entities/company.entity';
import { TransactionEntity } from '../entities/transaction.entity';
import { Connection, createConnection, Repository } from 'typeorm';
import { TransactionsService } from './transactions.service';
import * as alphavantage from 'alphavantage';
import * as stocks from 'stock-ticker-symbol';
import { TransactionDto } from 'src/dtos/add-transation.dto';

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
    const validRequest: TransactionDto[] = [
      {
        company: {
          name: companyName,
          symbol: companySymbol,
        },
        amount: 2200,
        date: new Date(),
      },
    ];

    const falsyResult = await companyRepo.findOne({
      name: companyName,
      symbol: companySymbol,
    });
    expect(falsyResult).toBeFalsy();

    await service.addTransactions(validRequest);

    const truthlyResult = await companyRepo.findOne({
      name: companyName,
      symbol: companySymbol,
    });
    expect(truthlyResult).toBeTruthy();
  });

  it('should handle concurrent requests', async () => {
    // OK get some data
    // OK to 2 objects
    // add them with addTransactions simultaneously
    // check if data from both objects is valid and
    // if there is every record in there
    const alpha = alphavantage({ key: process.env.alpha_vintage_key });

    let companySymbols1 = ['TSLA', 'MSFT'];
    // let companySymbols2 = ['AAPL', 'AMZN'];

    const companies1 = await createCompanies(companySymbols1, alpha);
    // const companies2 = await createCompanies(companySymbols2, alpha);

    console.log(await companies1[0].name);
    // console.log(companyData1[0]['Time Series (1min)']);
  }, 30_000);

  async function createCompanies(symbols: string[], alpha: any) {
    const companies = [];
    for (const symbol of symbols) {
      const data = await alpha.data.intraday(symbol, 'compact');
      companies.push({
        name: await stocks.lookup(symbol),
        symbol: symbol,
        data: data,
      });
    }
    return companies;
  }
});
