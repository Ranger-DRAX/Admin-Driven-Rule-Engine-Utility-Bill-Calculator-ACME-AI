import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';

export class CalculateBillDto {
  @IsString()
  @IsOptional()
  consumerName?: string;

  @IsString()
  @IsOptional()
  consumerId?: string;

  @IsEnum(['residential', 'commercial', 'industrial'])
  @IsNotEmpty()
  consumerType: 'residential' | 'commercial' | 'industrial';

  @IsNumber()
  @Min(0)
  unitsConsumed: number;

  @IsString()
  @IsOptional()
  calculationMonth?: string; // Format: YYYY-MM
}
