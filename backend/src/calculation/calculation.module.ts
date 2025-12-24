import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalculationService } from './calculation.service';
import { CalculationController } from './calculation.controller';
import { CalculationHistory } from './entities/calculation-history.entity';
import { ConfigModule } from '../config/config.module';
import { PdfService } from './pdf.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CalculationHistory]),
    ConfigModule,
  ],
  controllers: [CalculationController],
  providers: [CalculationService, PdfService],
  exports: [CalculationService],
})
export class CalculationModule {}
