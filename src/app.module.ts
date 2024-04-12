import { Module } from '@nestjs/common';
import { AnalyticsModule } from './analytics/analytics.module';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { GlobalValidationPipe } from './common/pipes/global-validation-pipe';

@Module({
  imports: [ConfigModule.forRoot(), AnalyticsModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: GlobalValidationPipe,
    },
  ],
})
export class AppModule {}
