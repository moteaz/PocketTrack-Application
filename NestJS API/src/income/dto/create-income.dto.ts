import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIncomeDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  source: string;
  @IsString()
  @IsOptional()
  icon: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;
}
