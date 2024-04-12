import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MeasurementProtocolModule } from '../measurement-protocol/measurement-protocol.module';

@Module({
  imports: [
    MeasurementProtocolModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        apiSecret: configService.get<string>('GOOGLE_ANALYTICS_API_SECRET'),
        measurementId: configService.get<string>(
          'GOOGLE_ANALYTICS_MEASUREMENT_ID',
        ),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
