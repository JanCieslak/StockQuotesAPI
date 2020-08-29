import { IsString, ValidateNested, IsInt, IsNumber } from 'class-validator';

export class CompanyDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly symbol: string;
}

export class TransactionDto {
  @ValidateNested()
  readonly company: CompanyDto;

  @IsInt()
  @IsNumber()
  readonly amount: number;
}
