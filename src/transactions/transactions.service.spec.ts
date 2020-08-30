import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsService],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add valid transaction to the database', async () => {
    const companyName = 'TEST_COMPANY_NAME';
    const companySymbol = 'TEST_COMPANY_SYMBOL';

    const validRequest = `[ { "company": { "name": "${companyName}", "symbol": "${companySymbol}" }, "amount": 2200 } ]`;

    // const falsyResult = await companyRepo.findOne({
    //   name: companyName,
    //   symbol: companySymbol,
    // });
    // expect(falsyResult).toBeFalsy();

    await service.addTransactions(JSON.parse(validRequest));

    // const truthlyResult = await companyRepo.findOne({
    //   name: companyName,
    //   symbol: companySymbol,
    // });
    // expect(truthlyResult).toBeTruthy();
  });


  it('should handle concurrent requests', () => {
    // edge case same (new) company names

  });
});
