import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsEnum, IsDateString, Min } from 'class-validator';

export class CreateConfigDto {
  @IsString()
  @IsNotEmpty()
  rateName: string;

  @IsEnum(['base_rate', 'tax', 'surcharge', 'tier_rate'])
  @IsNotEmpty()
  rateType: 'base_rate' | 'tax' | 'surcharge' | 'tier_rate';

  @IsNumber()
  @Min(0)
  rateValue: number;

  @IsEnum(['per_kwh', 'percentage', 'fixed'])
  @IsOptional()
  unitType?: 'per_kwh' | 'percentage' | 'fixed';

  @IsEnum(['residential', 'commercial', 'industrial', 'all'])
  @IsOptional()
  consumerType?: 'residential' | 'commercial' | 'industrial' | 'all';

  @IsNumber()
  @IsOptional()
  @Min(0)
  tierMinUnits?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  tierMaxUnits?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  vatPercentage?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  fixedServiceCharge?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDateString()
  @IsOptional()
  effectiveFrom?: string;

  @IsDateString()
  @IsOptional()
  effectiveTo?: string;
}
