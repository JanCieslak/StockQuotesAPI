export class CompanyDto {
  readonly name: string;
  readonly symbol: string;
}

export class TransactionDto {
  readonly company: CompanyDto;
  readonly amount: number;
}
