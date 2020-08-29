import {
  IsString,
  ValidateNested,
  IsInt,
  IsArray,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CompanyDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly symbol: string;
}

export class TransactionDto {
  @ValidateNested()
  @IsObject()
  @Type(() => CompanyDto)
  readonly company: CompanyDto;

  @IsInt()
  readonly amount: number;
}

export class TransactionsDto {
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => TransactionDto)
  transactions: TransactionDto[];
}
