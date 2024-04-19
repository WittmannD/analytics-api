import { Injectable } from '@nestjs/common';
import { PageViewEventDto } from './dto/page-view-event.dto';
import { MeasurementProtocolService } from '../measurement-protocol/measurement-protocol.service';
import { FirstVisitEventDto } from './dto/first-visit-event.dto';
import { DepositEventDto } from './dto/deposit-event.dto';
import { AnalyticsInternalApiService } from '../measurement-protocol/analytics-internal-api.service';

interface EventOptions {
  apiSecret: string;
  measurementId: string;
  clientId: string;
  userId?: string;
}

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly mpService: MeasurementProtocolService,
    private readonly gaInternalApiService: AnalyticsInternalApiService,
  ) {}

  async pageView(event: PageViewEventDto, options: EventOptions) {
    return await this.mpService.event('page_view', event, options);
  }

  async firstVisit(event: FirstVisitEventDto, options: EventOptions) {
    return await this.gaInternalApiService.event('first_visit', event, options);
  }

  async deposit(event: DepositEventDto, options: EventOptions) {
    return await this.mpService.event('deposit', event, options);
  }

  async customEvents(
    events: Array<{ name: string; params?: Record<string, any> }>,
    options: EventOptions,
  ) {
    return await this.mpService.batchEvent(events, options);
  }
}
