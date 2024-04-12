import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { MEASUREMENT_PROTOCOL_OPTIONS } from './constants';
import { ModuleOptions } from './interfaces';
import * as crypto from 'node:crypto';
import * as _ from 'lodash';
import { firstValueFrom } from 'rxjs';
import { fillOptions } from './default.config';

export interface FireEventOptions extends Required<ModuleOptions> {
  clientId?: string;
}

@Injectable()
export class MeasurementProtocolService {
  constructor(
    @Inject(MEASUREMENT_PROTOCOL_OPTIONS)
    private readonly options: ModuleOptions,
    private readonly httpService: HttpService,
  ) {}

  private createClientId() {
    return crypto.randomUUID();
  }

  private checkOrCreateSessionId(sessionId?: number) {
    const currentSessionIdInMs = new Date(sessionId).getTime();
    const currentTimeInMs = Date.now();

    if (
      !sessionId ||
      (currentTimeInMs - currentSessionIdInMs) / 60000 >
        this.options.sessionExpirationInMin
    ) {
      return currentTimeInMs;
    }

    return sessionId;
  }

  private getHttpConfig(options?: ModuleOptions) {
    const config = fillOptions(options as ModuleOptions);
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

  async fireEvent(
    name: string,
    params?: Record<string, any> & { session_id?: number },
    options?: Partial<FireEventOptions>,
  ) {
    const config = _.defaultsDeep(options, this.options) as FireEventOptions;
    const sessionId = this.checkOrCreateSessionId(params?.sessionId);
    const clientId = config?.clientId || this.createClientId();

    params.session_id = sessionId;
    params.engagement_time_msec =
      params.engagement_time_msec || config.defaultEngagementTimeMsec;

    const payload = {
      client_id: clientId,
      events: [{ name, params }],
    };

    const response = await firstValueFrom(
      this.httpService.post('', payload, this.getHttpConfig(config)),
    );

    console.log(config, params, response.status);

    if (config.debug) {
      const validation = response.data;
      console.log(
        `Event: ${name} with parameters ${JSON.stringify(
          payload,
        )} don't pass validation ${JSON.stringify(validation)}`,
      );
    }

    return {
      clientId,
      sessionId,
    };
  }
}
