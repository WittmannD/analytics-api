import { Inject, Injectable, Logger } from '@nestjs/common';
import crypto from 'node:crypto';
import { isAxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as _ from 'lodash';
import * as qs from 'qs';
import { MEASUREMENT_PROTOCOL_OPTIONS } from './constants';
import { ModuleOptions } from './interfaces';
import { SessionService } from './session.service';
import { HttpServiceError } from '../common/errors/http-service-error';
import { inspectObject } from '../common/utils/log';

export interface HitOptions extends Required<ModuleOptions> {
  clientId?: string;
}

@Injectable()
export class AnalyticsInternalApiService {
  private readonly endpoint = 'https://www.google-analytics.com/g/collect';
  private readonly logger = new Logger(AnalyticsInternalApiService.name);

  constructor(
    @Inject(MEASUREMENT_PROTOCOL_OPTIONS)
    private readonly options: ModuleOptions,
    private readonly sessionService: SessionService,
    private readonly httpService: HttpService,
  ) {}

  private getHttpConfig() {
    return {
      headers: {
        'Content-Type': 'text/plain',
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      },
    };
  }

  private createClientId() {
    return crypto.randomUUID();
  }

  async event(
    name: string,
    params?: Record<string, any>,
    options?: Partial<HitOptions>,
  ) {
    const config = _.defaultsDeep(options, this.options) as HitOptions;
    const clientId = config?.clientId || this.createClientId();
    const session = await this.sessionService.getOrCreate(clientId, config);

    const {
      language: ul,
      page_title: dt,
      engagement_time_msec: _et,
      page_referrer: dr,
      page_location: dl,
      campaign_id: ci,
      campaign: cn,
      source: cs,
      medium: cm,
      content: cc,
      term: ct,
      ...eventParams
    } = params;

    const queryParams = {
      v: 2,
      _p: Date.now() - 100,
      cid: clientId,
      sid: session.sessionId,
      tid: config.measurementId,
      en: name,
      ep: eventParams,
      ul,
      dt,
      dl,
      dr,
      ci,
      cn,
      cs,
      cm,
      cc,
      ct,
      _et,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          this.endpoint +
            qs.stringify(queryParams, {
              allowDots: true,
              skipNulls: true,
              addQueryPrefix: true,
            }),
          null,
          this.getHttpConfig(),
        ),
      );
      this.logger.log(
        `Response ${response.status}. Event: ${inspectObject(queryParams)}`,
      );
    } catch (err: any) {
      if (isAxiosError(err)) {
        throw new HttpServiceError(
          err.message,
          err.config,
          err.response?.config,
        );
      }
    }

    return {
      session_id: session.sessionId,
      client_id: clientId,
    };
  }
}
