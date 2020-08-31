import {
  IsString,
  ValidateNested,
  IsArray,
  IsObject,
  IsNumber,
  IsDate,
  IsDateString,
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

  @IsDateString()
  readonly date: Date;

  @IsNumber()
  readonly amount: number;
}
