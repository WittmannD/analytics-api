import { Inject, Injectable } from '@nestjs/common';
import { MEASUREMENT_PROTOCOL_OPTIONS } from './constants';
import { ModuleOptions } from './interfaces';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as _ from 'lodash';
import * as qs from 'qs';
import { SessionService } from './session.service';
import crypto from 'node:crypto';

export interface HitOptions extends Required<ModuleOptions> {
  clientId?: string;
}

@Injectable()
export class GAInternalApiService {
  constructor(
    @Inject(MEASUREMENT_PROTOCOL_OPTIONS)
    private readonly options: ModuleOptions,
    private readonly sessionService: SessionService,
    private readonly httpService: HttpService,
  ) {}

  private getHttpConfig() {
    const endpoint = 'https://www.google-analytics.com/g/collect';

    return {
      baseURL: endpoint,
      headers: {
        'Content-Type': 'application/json',
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
      _p: Date.now(),
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

    const response = await firstValueFrom(
      this.httpService.post(
        qs.stringify(queryParams, { allowDots: true, skipNulls: true }),
        null,
        this.getHttpConfig(),
      ),
    );

    console.log(response.status, response.data);
  }
}
