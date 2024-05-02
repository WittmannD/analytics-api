import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MeasurementProtocolModule } from '../measurement-protocol/measurement-protocol.module';
import { DiskStorage } from '../measurement-protocol/storage/disk-storage';

@Module({
  imports: [
    MeasurementProtocolModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        apiSecret: configService.get<string>('GOOGLE_ANALYTICS_API_SECRET'),
        measurementId: configService.get<string>(
          'GOOGLE_ANALYTICS_MEASUREMENT_ID',
        ),
        storage: DiskStorage,
        debug: Boolean(configService.get<string>('GOOGLE_ANALYTICS_DEBUG')),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
