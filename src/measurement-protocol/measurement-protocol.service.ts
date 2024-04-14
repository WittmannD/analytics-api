import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'node:crypto';
import * as _ from 'lodash';
import {
  MEASUREMENT_PROTOCOL_OPTIONS,
} from './constants';
import { ModuleOptions } from './interfaces';
import { SessionService } from './session.service';

export interface FireEventOptions extends Required<ModuleOptions> {
  clientId?: string;
}

@Injectable()
export class MeasurementProtocolService {
  constructor(
    @Inject(MEASUREMENT_PROTOCOL_OPTIONS)
    private readonly options: ModuleOptions,
    private readonly sessionService: SessionService,
    private readonly httpService: HttpService,
  ) {}

  private createClientId() {
    return crypto.randomUUID();
  }

  private getHttpConfig(config: Required<ModuleOptions>) {
    const endpoint = config.debug
      ? `https://www.google-analytics.com/debug/mp/collect?measurement_id=${config.measurementId}&api_secret=${config.apiSecret}`
      : `https://www.google-analytics.com/mp/collect?measurement_id=${config.measurementId}&api_secret=${config.apiSecret}`;

    return {
      baseURL: endpoint,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async event(
    name: string,
    params?: Record<string, any> & { session_id?: number },
    options?: Partial<FireEventOptions>,
  ) {
    const config = _.defaultsDeep(options, this.options) as FireEventOptions;
    const clientId = config?.clientId || this.createClientId();
    const session = await this.sessionService.getOrCreate(clientId, config);

    params.session_id = session.sessionId;
    params.engagement_time_msec =
      params.engagement_time_msec || config.defaultEngagementTimeMsec;

    const payload = {
      client_id: clientId,
      events: [{ name, params }],
    };

    const response = await firstValueFrom(
      this.httpService.post('', payload, this.getHttpConfig(config)),
    );

    await this.sessionService.update?.(clientId, {
      ...session,
      ...payload,
      lastOperationAt: new Date(),
    });
    console.log(config, params, response.status);

    if (config.debug) {
      const validation = response.data;
      console.log(
        `Event: ${name} with parameters ${JSON.stringify(
          payload,
        )} didn't pass validation ${JSON.stringify(validation)}`,
      );
    }

    return {
      clientId,
      sessionId: session.sessionId,
    };
  }
}
