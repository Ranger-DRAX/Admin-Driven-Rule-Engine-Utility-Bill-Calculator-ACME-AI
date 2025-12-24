import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Database Module - Neon PostgreSQL Configuration
 * Supports both development and production environments
 * SSL is automatically enabled for Neon PostgreSQL
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const isProduction = configService.get<string>('NODE_ENV') === 'production';

        // If DATABASE_URL is provided (Neon PostgreSQL)
        if (databaseUrl && databaseUrl.includes('postgresql://')) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: !isProduction, // Only auto-sync in development
            autoLoadEntities: true,
            logging: !isProduction,
            ssl: {
              rejectUnauthorized: false, // Required for Neon and most cloud PostgreSQL providers
            },
            // Connection pool settings for production
            extra: {
              max: 10, // Maximum number of connections
              connectionTimeoutMillis: 10000,
            },
          };
        }

        // Fallback to SQLite for local development without DATABASE_URL
        return {
          type: 'sqlite',
          database: 'electricity_billing.db',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
          autoLoadEntities: true,
          logging: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
