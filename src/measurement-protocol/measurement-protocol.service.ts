import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'node:crypto';
import * as _ from 'lodash';
import { MEASUREMENT_PROTOCOL_OPTIONS } from './constants';
import { ModuleOptions } from './interfaces';
import { SessionService } from './session.service';
import { HttpServiceError } from '../common/errors/http-service-error';
import { inspectObject } from '../common/utils/log';

export interface FireEventOptions extends Required<ModuleOptions> {
  clientId?: string;
  userId?: string;
}

@Injectable()
export class MeasurementProtocolService {
  private readonly logger = new Logger(MeasurementProtocolService.name);

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

  private async send(payload: any, config: Required<ModuleOptions>) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('', payload, this.getHttpConfig(config)),
      );

      this.logger.log(
        `Response ${response.status}. Event: ${inspectObject(payload)}`,
      );
    } catch (err: any) {
      if (isAxiosError(err)) {
        if (config.debug) {
          const validation = err.response?.data;

          this.logger.error(
            `Event with parameters ${inspectObject(payload)} \
            didn't pass validation ${inspectObject(validation)}`,
          );
        }

        throw new HttpServiceError(
          err.message,
          err.config,
          err.response?.config,
        );
      }

      throw err;
    }

    const sessionId = payload.events[0].params.session_id;

    await this.sessionService.update?.(payload.client_id, {
      sessionId,
      ...payload,
      lastOperationAt: new Date(),
    });
  }

  async event(
    name: string,
    params?: Record<string, any> & { session_id?: number },
    options?: Partial<FireEventOptions>,
  ) {
    const config = _.defaultsDeep(options, this.options) as FireEventOptions;
    const clientId = config?.clientId || this.createClientId();
    const userId = config?.userId;
    const session = await this.sessionService.getOrCreate(clientId, config);

    params.session_id = session.sessionId;
    params.engagement_time_msec =
      params.engagement_time_msec || config.defaultEngagementTimeMsec;

    params = _(params).omitBy(_.isUndefined).omitBy(_.isNull).value();

    const payload = {
      client_id: clientId,
      user_id: userId,
      events: [
        {
          name,
          params,
        },
      ],
    };

    await this.send(payload, config);

    return {
      client_id: clientId,
      session_id: session.sessionId,
    };
  }

  async batchEvent(
    events: Array<{ name: string; params?: Record<string, any> }>,
    options?: Partial<FireEventOptions>,
  ) {
    const config = _.defaultsDeep(options, this.options) as FireEventOptions;
    const clientId = config?.clientId || this.createClientId();
    const userId = config?.userId;
    const session = await this.sessionService.getOrCreate(clientId, config);

    const payload = {
      client_id: clientId,
      user_id: userId,
      events: [],
    };

    for (const event of events) {
      const params = _({
        ...event.params,
        session_id: session.sessionId,
        engagement_time_msec:
          event.params.engagement_time_msec || config.defaultEngagementTimeMsec,
      })
        .omitBy(_.isUndefined)
        .omitBy(_.isNull)
        .value();

      payload.events.push({
        name: event.name,
        params,
      });
    }

    await this.send(payload, config);

    return {
      client_id: clientId,
      session_id: session.sessionId,
    };
  }
}
