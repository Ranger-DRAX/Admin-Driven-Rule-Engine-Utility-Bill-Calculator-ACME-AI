import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Health check endpoint - verifies database connectivity
   * Use this to test if Neon PostgreSQL connection is working
   */
  @Get('health')
  async healthCheck() {
    try {
      // Test database connection with a simple query
      const result = await this.dataSource.query('SELECT NOW() as time, version() as db_version');
      
      return {
        status: 'healthy',
        database: 'connected',
        timestamp: result[0].time,
        database_type: this.dataSource.options.type,
        database_version: result[0].db_version,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        database: 'disconnected',
        error: error.message,
      };
    }
  }

  /**
   * Simple database ping - returns just connection status
   */
  @Get('health/db')
  async databasePing() {
    try {
      await this.dataSource.query('SELECT 1');
      return { connected: true, database: this.dataSource.options.type };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }
}
