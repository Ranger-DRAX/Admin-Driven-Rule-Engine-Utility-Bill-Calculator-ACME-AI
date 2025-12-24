import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from './entities/config.entity';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

/**
 * Service for managing electricity billing rate configurations
 * Handles CRUD operations, caching, and rate retrieval
 */
@Injectable()
export class ConfigService {
  // In-memory cache for frequently accessed flat rate data
  private flatRateCache: { ratePerUnit: number; vatPercentage: number; fixedServiceCharge: number } | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_TTL = 60000; // Cache valid for 1 minute

  constructor(
    @InjectRepository(Config)
    private configRepository: Repository<Config>,
  ) {}

  /**
   * Create a new rate configuration
   * Clears cache to ensure fresh data on next read
   * @param createConfigDto - Configuration data
   * @param adminId - Optional admin ID who created the config
   * @returns Created configuration
   */
  async create(createConfigDto: CreateConfigDto, adminId?: string): Promise<Config> {
    // Clear cache to force reload of updated rates
    this.flatRateCache = null;
    
    const config = this.configRepository.create({
      ...createConfigDto,
      createdBy: adminId ? { id: adminId } as any : null,
    });
    return this.configRepository.save(config);
  }

  async findAll(): Promise<Config[]> {
    return this.configRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<Config[]> {
    const now = new Date();
    return this.configRepository
      .createQueryBuilder('config')
      .where('config.isActive = :isActive', { isActive: true })
      .andWhere('config.effectiveFrom <= :now', { now })
      .andWhere('(config.effectiveTo IS NULL OR config.effectiveTo >= :now)', { now })
      .orderBy('config.consumerType', 'ASC')
      .addOrderBy('config.tierMinUnits', 'ASC')
      .getMany();
  }

  async findByConsumerType(consumerType: string): Promise<Config[]> {
    return this.configRepository.find({
      where: [
        { consumerType: consumerType as any, isActive: true },
        { consumerType: 'all', isActive: true },
      ],
      order: { tierMinUnits: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Config> {
    const config = await this.configRepository.findOne({ where: { id } });
    if (!config) {
      throw new NotFoundException(`Config with ID ${id} not found`);
    }
    return config;
  }

  /**
   * Update an existing configuration
   * Clears cache to ensure fresh data
   * @param id - Configuration ID
   * @param updateConfigDto - Updated configuration data
   * @returns Updated configuration
   */
  async update(id: string, updateConfigDto: UpdateConfigDto): Promise<Config> {
    // Clear cache to force reload
    this.flatRateCache = null;
    
    const config = await this.findOne(id);
    Object.assign(config, updateConfigDto);
    return this.configRepository.save(config);
  }

  async remove(id: string): Promise<void> {
    const config = await this.findOne(id);
    await this.configRepository.remove(config);
  }

  /**
   * Toggle active status of a configuration
   * Clears cache to reflect status change
   * @param id - Configuration ID
   * @returns Updated configuration
   */
  async toggleActive(id: string): Promise<Config> {
    // Clear cache when toggling status
    this.flatRateCache = null;
    
    const config = await this.findOne(id);
    config.isActive = !config.isActive;
    return this.configRepository.save(config);
  }

  async getTierRates(consumerType: string): Promise<Config[]> {
    return this.configRepository.find({
      where: {
        consumerType: consumerType as any,
        rateType: 'tier_rate',
        isActive: true,
      },
      order: { tierMinUnits: 'ASC' },
    });
  }

  async getTaxesAndSurcharges(consumerType: string): Promise<{
    taxes: Config[];
    surcharges: Config[];
  }> {
    const configs = await this.configRepository.find({
      where: [
        { consumerType: consumerType as any, isActive: true },
        { consumerType: 'all', isActive: true },
      ],
    });

    return {
      taxes: configs.filter(c => c.rateType === 'tax'),
      surcharges: configs.filter(c => c.rateType === 'surcharge'),
    };
  }

  /**
   * Get current active flat rate with VAT and service charge
   * Uses in-memory caching (60s TTL) for performance
   * Returns default values if no active rate exists
   * @returns Current rate configuration
   */
  async getCurrentFlatRate(): Promise<{ ratePerUnit: number; vatPercentage: number; fixedServiceCharge: number }> {
    const now = Date.now();
    
    // Return cached value if within TTL (1 minute)
    if (this.flatRateCache && (now - this.cacheTimestamp) < this.CACHE_TTL) {
      return this.flatRateCache;
    }

    const activeRates = await this.configRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      take: 1,
    });
    
    let result: { ratePerUnit: number; vatPercentage: number; fixedServiceCharge: number };
    
    if (activeRates.length > 0) {
      result = {
        ratePerUnit: Number(activeRates[0].rateValue),
        vatPercentage: Number(activeRates[0].vatPercentage || 0),
        fixedServiceCharge: Number(activeRates[0].fixedServiceCharge || 0),
      };
    } else {
      result = { ratePerUnit: 0.12, vatPercentage: 15, fixedServiceCharge: 5 }; // Defaults
    }
    
    // Cache the result
    this.flatRateCache = result;
    this.cacheTimestamp = now;
    
    return result;
  }

  async updateFlatRate(
    newRate: number, 
    vatPercentage: number, 
    fixedServiceCharge: number, 
    adminId?: string
  ): Promise<Config> {
    // Clear cache
    this.flatRateCache = null;
    
    // Deactivate all existing rates
    await this.configRepository.update({ isActive: true }, { isActive: false });
    
    // Create new flat rate
    return this.create({
      rateName: 'Flat Rate',
      rateType: 'tier_rate',
      rateValue: newRate,
      vatPercentage: vatPercentage,
      fixedServiceCharge: fixedServiceCharge,
      consumerType: 'all',
      isActive: true,
      effectiveFrom: new Date(),
    } as any, adminId);
  }
}
