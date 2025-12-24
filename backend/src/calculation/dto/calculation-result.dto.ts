export class TierBreakdown {
  tierName: string;
  unitsInTier: number;
  ratePerUnit: number;
  amount: number;
}

export class TaxBreakdown {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}

export class CalculationResultDto {
  consumerName?: string;
  consumerId?: string;
  consumerType: string;
  unitsConsumed: number;
  calculationMonth: string;
  
  // Base calculation
  tierBreakdown: TierBreakdown[];
  baseAmount: number;
  
  // Taxes
  taxes: TaxBreakdown[];
  totalTax: number;
  
  // Surcharges
  surcharges: TaxBreakdown[];
  totalSurcharge: number;
  
  // Final
  totalAmount: number;
  
  // Metadata
  calculationDate: Date;
  appliedRates: any[];
}
