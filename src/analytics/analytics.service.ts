import { Injectable } from '@nestjs/common';
import { PageViewEventDto } from './dto/page-view-event.dto';
import { MeasurementProtocolService } from '../measurement-protocol/measurement-protocol.service';
import { FirstVisitEventDto } from './dto/first-visit-event.dto';
import { DepositEventDto } from './dto/deposit-event.dto';

interface EventOptions {
  apiSecret: string;
  measurementId: string;
  clientId: string;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly mpService: MeasurementProtocolService) {}

  async pageView(event: PageViewEventDto, options: EventOptions) {
    return await this.mpService.fireEvent('page_view', event, options);
  }

  async firstVisit(event: FirstVisitEventDto, options: EventOptions) {
    // TODO: first visit event
    return await this.mpService.fireEvent('page_view', event, options);
  }

  async deposit(event: DepositEventDto, options: EventOptions) {
    // TODO: deposit event
    return await this.mpService.fireEvent('page_view', event, options);
  }

  async customEvents(
    events: Array<Record<string, any>>,
    options: EventOptions,
  ) {
    // TODO: custom events
    return await this.mpService.fireEvent('page_view', events[0], options);
  }
}
