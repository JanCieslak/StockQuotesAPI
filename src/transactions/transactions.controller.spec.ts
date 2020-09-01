import { Test, TestingModule } from '@nestjs/testing';
import { mockConnection } from '../utils/test-helpers/mock-connection';
import { Connection } from 'typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let connection: Connection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        {
          provide: Connection,
          useFactory: mockConnection,
        },
      ],
    }).compile();

    connection = module.get<Connection>(Connection);
    controller = module.get<TransactionsController>(TransactionsController);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
