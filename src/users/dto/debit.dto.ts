import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, Max } from 'class-validator';

export class DebitDto {
  @ApiProperty({ example: 100.0, description: 'Amount to debit (positive, max 2 decimal places)' })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(999999999999.99)
  amount: number;
}
