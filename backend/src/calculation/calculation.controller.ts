import { Controller, Get, Post, Body, Param, Query, UseGuards, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { CalculationService } from './calculation.service';
import { CalculateBillDto } from './dto/calculate-bill.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PdfService } from './pdf.service';

@Controller('calculation')
export class CalculationController {
  constructor(
    private readonly calculationService: CalculationService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  calculateBill(@Body() calculateBillDto: CalculateBillDto) {
    return this.calculationService.calculateBill(calculateBillDto);
  }

  @Post('pdf')
  async generatePdf(@Body() calculateBillDto: CalculateBillDto, @Res() res: Response) {
    const result = await this.calculationService.calculateBill(calculateBillDto);
    const pdfBuffer = await this.pdfService.generateBillPdf(result);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=bill-${result.calculationMonth}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.status(HttpStatus.OK).send(pdfBuffer);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  getHistory(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.calculationService.getHistory(pageNum, limitNum);
  }

  @Get('history/:id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  getHistoryById(@Param('id') id: string) {
    return this.calculationService.getHistoryById(id);
  }

  @Get('history/consumer/:consumerId')
  getHistoryByConsumerId(@Param('consumerId') consumerId: string) {
    return this.calculationService.getHistoryByConsumerId(consumerId);
  }

  @Get('stats/:month')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  getMonthlyStats(@Param('month') month: string) {
    return this.calculationService.getMonthlyStats(month);
  }
}
