import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MeasurementProtocolService } from './measurement-protocol.service';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './measurement-protocol.module-definition';
import { ModuleOptions } from './interfaces';
import {
  MEASUREMENT_PROTOCOL_OPTIONS,
  MEASUREMENT_PROTOCOL_SESSION_STORAGE,
} from './constants';
import { fillOptions } from './default.config';
import { SessionService } from './session.service';
import { AnalyticsInternalApiService } from './analytics-internal-api.service';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: MEASUREMENT_PROTOCOL_OPTIONS,
      useFactory: (options: ModuleOptions) => ({ ...fillOptions(options) }),
      inject: [MODULE_OPTIONS_TOKEN],
    },
    {
      provide: MEASUREMENT_PROTOCOL_SESSION_STORAGE,
      useFactory: async (options: ModuleOptions) => {
        const storage = new options.storage();
        await storage.initialize();
        return storage;
      },
      inject: [MODULE_OPTIONS_TOKEN],
    },
    SessionService,
    MeasurementProtocolService,
    AnalyticsInternalApiService,
  ],
  exports: [MeasurementProtocolService, AnalyticsInternalApiService],
})
export class MeasurementProtocolModule extends ConfigurableModuleClass {}
