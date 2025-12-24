export interface Admin {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  admin: Admin;
}

export interface Config {
  id: number;
  rateName: string;
  rateType: 'base_rate' | 'tax' | 'surcharge' | 'tier_rate';
  rateValue: number;
  unitType: 'per_kwh' | 'percentage' | 'fixed';
  consumerType: 'residential' | 'commercial' | 'industrial' | 'all';
  tierMinUnits: number;
  tierMaxUnits: number | null;
  vatPercentage: number;
  fixedServiceCharge: number;
  description?: string;
  isActive: boolean;
  // Legacy fields for compatibility
  ratePerUnit?: number;
  tierName?: string;
  surchargeName?: string;
  surchargeAmount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Configuration request supporting both old and new field naming conventions
 * Used for creating and updating rate configurations
 */
export interface CreateConfigRequest {
  consumerType: 'residential' | 'commercial' | 'industrial';
  // New field names
  rateName?: string;
  rateType?: 'base_rate' | 'tax' | 'surcharge' | 'tier_rate';
  rateValue?: number;
  unitType?: 'per_kwh' | 'percentage' | 'fixed';
  tierMinUnits?: number;
  tierMaxUnits?: number | null;
  // Legacy field names
  tierName?: string;
  minUnits?: number;
  maxUnits?: number | null;
  ratePerUnit?: number;
  // Common fields
  vatPercentage: number;
  fixedServiceCharge: number;
  taxName?: string;
  taxPercentage?: number;
  surchargeName?: string;
  surchargeAmount?: number;
  isActive?: boolean;
}

export interface CalculateBillRequest {
  consumerName?: string;
  consumerId?: string;
  consumerType: 'residential' | 'commercial' | 'industrial';
  unitsConsumed: number;
  calculationMonth?: string;
}

export interface TierBreakdown {
  tierName: string;
  unitsInTier: number;
  ratePerUnit: number;
  amount: number;
}

export interface TaxBreakdown {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}

export interface CalculationResult {
  consumerName?: string;
  consumerId?: string;
  consumerType: string;
  unitsConsumed: number;
  calculationMonth: string;
  tierBreakdown: TierBreakdown[];
  baseAmount: number;
  taxes: TaxBreakdown[];
  totalTax: number;
  surcharges: TaxBreakdown[];
  totalSurcharge: number;
  totalAmount: number;
  calculationDate: string;
  appliedRates: Config[];
}

export interface CalculationHistory {
  id: string;
  consumerName: string | null;
  consumerId: string | null;
  consumerType: 'residential' | 'commercial' | 'industrial';
  unitsConsumed: number;
  baseAmount: number;
  taxAmount: number;
  surchargeAmount: number;
  totalAmount: number;
  calculationMonth: string;
  rateBreakdown: any;
  appliedRates: any;
  createdAt: string;
}
