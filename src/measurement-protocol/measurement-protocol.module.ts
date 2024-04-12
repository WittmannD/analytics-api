import { DynamicModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MeasurementProtocolService } from './measurement-protocol.service';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './measurement-protocol.module-definition';
import { ModuleOptions } from './interfaces';
import { MEASUREMENT_PROTOCOL_OPTIONS } from './constants';
import { fillOptions } from './default.config';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: MEASUREMENT_PROTOCOL_OPTIONS,
      useFactory: (options: ModuleOptions) => ({ ...fillOptions(options) }),
      inject: [MODULE_OPTIONS_TOKEN],
    },
    MeasurementProtocolService,
  ],
  exports: [MeasurementProtocolService],
})
export class MeasurementProtocolModule extends ConfigurableModuleClass {}