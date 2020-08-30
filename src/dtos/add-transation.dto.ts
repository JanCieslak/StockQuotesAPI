import { IsString, ValidateNested, IsObject, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyDto {
  @ApiProperty({ type: String, description: 'name', example: 'Tesla' })
  @IsString()
  readonly name: string;

  @ApiProperty({ type: String, description: 'symbol', example: 'TSLA' })
  @IsString()
  readonly symbol: string;
}

export class TransactionDto {
  @ApiProperty({ type: CompanyDto, description: 'company' })
  @ValidateNested()
  @IsObject()
  @Type(() => CompanyDto)
  readonly company: CompanyDto;

  @ApiProperty({ type: Number, description: 'amount', example: 2200 })
  @IsNumber()
  readonly amount: number;
}
