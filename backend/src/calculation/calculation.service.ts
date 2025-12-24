import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalculationHistory } from './entities/calculation-history.entity';
import { ConfigService } from '../config/config.service';
import { CalculateBillDto } from './dto/calculate-bill.dto';
import { CalculationResultDto, TierBreakdown, TaxBreakdown } from './dto/calculation-result.dto';

/**
 * Service responsible for electricity bill calculations
 * Handles bill computation, history management, and statistics
 */
@Injectable()
export class CalculationService {
  constructor(
    @InjectRepository(CalculationHistory)
    private calculationRepository: Repository<CalculationHistory>,
    private configService: ConfigService,
  ) {}

  /**
   * Calculate electricity bill based on units consumed
   * Applies current flat rate, VAT percentage, and fixed service charge
   * Automatically saves calculation to history
   * @param calculateBillDto - Contains consumer details and units consumed
   * @returns Complete calculation breakdown with all charges
   */
  async calculateBill(calculateBillDto: CalculateBillDto): Promise<CalculationResultDto> {
    const { consumerType, unitsConsumed, consumerName, consumerId, calculationMonth } = calculateBillDto;

    // Get current flat rate with VAT and service charge from configuration
    const rateConfig = await this.configService.getCurrentFlatRate();
    const { ratePerUnit, vatPercentage, fixedServiceCharge } = rateConfig;

    // Step 1: Calculate subtotal (base charge = units × rate)
    const subtotal = unitsConsumed * ratePerUnit;
    
    // Step 2: Calculate VAT (percentage of subtotal)
    const vatAmount = (subtotal * vatPercentage) / 100;
    
    // Step 3: Calculate total (subtotal + VAT + fixed service charge)
    const totalAmount = subtotal + vatAmount + fixedServiceCharge;

    // Prepare result
    const result: CalculationResultDto = {
      consumerName,
      consumerId,
      consumerType,
      unitsConsumed,
      calculationMonth: calculationMonth || this.getCurrentMonth(),
      tierBreakdown: [{
        tierName: 'Standard Rate',
        unitsInTier: unitsConsumed,
        ratePerUnit: ratePerUnit,
        amount: subtotal,
      }],
      baseAmount: this.roundToTwo(subtotal),
      taxes: [{
        name: 'VAT',
        type: 'percentage',
        value: vatPercentage,
        amount: this.roundToTwo(vatAmount),
      }],
      totalTax: this.roundToTwo(vatAmount),
      surcharges: [{
        name: 'Service Charge',
        type: 'fixed',
        value: fixedServiceCharge,
        amount: this.roundToTwo(fixedServiceCharge),
      }],
      totalSurcharge: this.roundToTwo(fixedServiceCharge),
      totalAmount: this.roundToTwo(totalAmount),
      calculationDate: new Date(),
      appliedRates: [],
    };

    // Save to history
    await this.saveToHistory(result);

    return result;
  }

  private calculateTierBreakdown(unitsConsumed: number, tierRates: any[]): TierBreakdown[] {
    const breakdown: TierBreakdown[] = [];
    let remainingUnits = unitsConsumed;

    for (let i = 0; i < tierRates.length && remainingUnits > 0; i++) {
      const tier = tierRates[i];
      const tierMin = tier.tierMinUnits;
      const tierMax = tier.tierMaxUnits || Infinity;
      const tierRange = tierMax - tierMin;

      // Units that fall within this tier
      const unitsInTier = Math.min(remainingUnits, tierMax - tierMin);
      
      if (unitsInTier > 0) {
        const amount = unitsInTier * Number(tier.rateValue);
        
        breakdown.push({
          tierName: tier.rateName,
          unitsInTier: this.roundToTwo(unitsInTier),
          ratePerUnit: Number(tier.rateValue),
          amount: this.roundToTwo(amount),
        });

        remainingUnits -= unitsInTier;
      }
    }

    // If there are still remaining units (exceeding all tiers), use the last tier rate
    if (remainingUnits > 0 && tierRates.length > 0) {
      const lastTier = tierRates[tierRates.length - 1];
      const amount = remainingUnits * Number(lastTier.rateValue);
      
      breakdown.push({
        tierName: `${lastTier.rateName} (Additional)`,
        unitsInTier: this.roundToTwo(remainingUnits),
        ratePerUnit: Number(lastTier.rateValue),
        amount: this.roundToTwo(amount),
      });
    }

    return breakdown;
  }

  private calculateTaxesAndSurcharges(baseAmount: number, configs: any[]): TaxBreakdown[] {
    return configs.map(config => {
      let amount = 0;
      let type: 'percentage' | 'fixed' = 'fixed';

      if (config.unitType === 'percentage') {
        amount = (baseAmount * Number(config.rateValue)) / 100;
        type = 'percentage';
      } else if (config.unitType === 'fixed') {
        amount = Number(config.rateValue);
        type = 'fixed';
      }

      return {
        name: config.rateName,
        type,
        value: Number(config.rateValue),
        amount: this.roundToTwo(amount),
      };
    });
  }

  private async saveToHistory(result: CalculationResultDto): Promise<void> {
    const history = this.calculationRepository.create({
      consumerName: result.consumerName,
      consumerId: result.consumerId,
      consumerType: result.consumerType as 'residential' | 'commercial' | 'industrial',
      unitsConsumed: result.unitsConsumed,
      baseAmount: result.baseAmount,
      taxAmount: result.totalTax,
      surchargeAmount: result.totalSurcharge,
      totalAmount: result.totalAmount,
      calculationMonth: result.calculationMonth,
      rateBreakdown: JSON.stringify({
        tierBreakdown: result.tierBreakdown,
        taxes: result.taxes,
        surcharges: result.surcharges,
      }),
      appliedRates: JSON.stringify(result.appliedRates),
    });

    await this.calculationRepository.save(history);
  }

  /**
   * Retrieve paginated calculation history
   * @param page - Page number (starts from 1)
   * @param limit - Number of records per page
   * @returns Calculation history data and total count
   */
  async getHistory(page: number = 1, limit: number = 10): Promise<{ data: CalculationHistory[]; total: number }> {
    const [data, total] = await this.calculationRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  /**
   * Get all calculation history for a specific consumer
   * @param consumerId - Unique consumer identifier
   * @returns List of calculations for the consumer
   */
  async getHistoryByConsumerId(consumerId: string): Promise<CalculationHistory[]> {
    return this.calculationRepository.find({
      where: { consumerId },
      order: { createdAt: 'DESC' },
    });
  }

  async getHistoryById(id: string): Promise<CalculationHistory | null> {
    return this.calculationRepository.findOne({ where: { id } });
  }

  async getMonthlyStats(month: string): Promise<any> {
    const stats = await this.calculationRepository
      .createQueryBuilder('calc')
      .select('calc.consumerType', 'consumerType')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(calc.unitsConsumed)', 'totalUnits')
      .addSelect('SUM(calc.totalAmount)', 'totalRevenue')
      .where('calc.calculationMonth = :month', { month })
      .groupBy('calc.consumerType')
      .getRawMany();

    return stats;
  }

  /**
   * Get current month in YYYY-MM format
   * @returns Current month string
   */
  private getCurrentMonth(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  /**
   * Round number to two decimal places
   * @param num - Number to round
   * @returns Rounded number
   */
  private roundToTwo(num: number): number {
    return Math.round(num * 100) / 100;
  }
}
