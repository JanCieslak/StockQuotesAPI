import {
  IsString,
  ValidateNested,
  IsObject,
  IsNumber,
  IsDateString,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty({ type: Date, description: 'date', example: new Date() })
  @IsDateString()
  readonly date: Date;

  @ApiProperty({ type: Number, description: 'amount', example: 2200 })
  @IsNumber()
  readonly amount: number;
}

export class CompanyDto {
  @ApiProperty({ type: String, description: 'name', example: 'Tesla' })
  @IsString()
  readonly name: string;

  @ApiProperty({ type: String, description: 'symbol', example: 'TSLA' })
  @IsString()
  readonly symbol: string;

  @ApiProperty({
    type: TransactionDto,
    isArray: true,
    description: 'transactions',
  })
  @ValidateNested()
  @IsArray()
  @Type(() => TransactionDto)
  readonly transactions: TransactionDto[];
}
