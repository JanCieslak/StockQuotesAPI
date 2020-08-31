import { IsString, ValidateNested, IsObject, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyDto {
  @ApiProperty({ type: String, description: 'name' })
  @IsString()
  readonly name: string;

  @ApiProperty({ type: String, description: 'symbol' })
  @IsString()
  readonly symbol: string;
}

export class TransactionDto {
  @ApiProperty({ type: CompanyDto, description: 'company' })
  @ValidateNested()
  @IsObject()
  @Type(() => CompanyDto)
  readonly company: CompanyDto;

  @IsDateString()
  readonly date: Date;
  @ApiProperty({ type: Number, description: 'amount' })
  @IsNumber()
  readonly amount: number;
}
