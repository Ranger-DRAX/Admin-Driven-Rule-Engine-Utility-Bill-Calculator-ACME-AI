import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  create(@Body() createConfigDto: CreateConfigDto, @CurrentUser() user: any) {
    return this.configService.create(createConfigDto, user.userId);
  }

  @Get()
  findAll(@Query('active') active?: string) {
    if (active === 'true') {
      return this.configService.findActive();
    }
    return this.configService.findAll();
  }

  @Get('consumer-type/:type')
  findByConsumerType(@Param('type') type: string) {
    return this.configService.findByConsumerType(type);
  }

  @Get('tier-rates/:type')
  getTierRates(@Param('type') type: string) {
    return this.configService.getTierRates(type);
  }

  @Get('taxes-surcharges/:type')
  getTaxesAndSurcharges(@Param('type') type: string) {
    return this.configService.getTaxesAndSurcharges(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  update(@Param('id') id: string, @Body() updateConfigDto: UpdateConfigDto) {
    return this.configService.update(id, updateConfigDto);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  toggleActive(@Param('id') id: string) {
    return this.configService.toggleActive(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.configService.remove(id);
  }
}
