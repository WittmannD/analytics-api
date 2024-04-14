import { Injectable } from '@nestjs/common';
import { PageViewEventDto } from './dto/page-view-event.dto';
import { MeasurementProtocolService } from '../measurement-protocol/measurement-protocol.service';
import { FirstVisitEventDto } from './dto/first-visit-event.dto';
import { DepositEventDto } from './dto/deposit-event.dto';
import { GAInternalApiService } from '../measurement-protocol/ga-internal-api.service';
import e from 'express';

interface EventOptions {
  apiSecret: string;
  measurementId: string;
  clientId: string;
}

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly mpService: MeasurementProtocolService,
    private readonly gaInternalApiService: GAInternalApiService,
  ) {}

  async pageView(event: PageViewEventDto, options: EventOptions) {
    return await this.mpService.event('page_view', event, options);
  }

  async firstVisit(event: FirstVisitEventDto, options: EventOptions) {
    // const campaignParams = {
    //   campaign: event.campaign,
    //   campaign_id: event.campaign_id,
    //   source: event.source,
    //   medium: event.medium,
    //   content: event.content,
    //   term: event.term,
    // };
    // const pageParams = {
    //   page_referrer: event.page_referrer,
    //   page_title: event.page_title,
    // };
    // const additionalParams = {
    //   language: event.language,
    //   engagement_time_msec: event.engagement_time_msec
    // };

    await this.gaInternalApiService.event('first_visit', event, options);
    await this.mpService.event('page_view', event, options);
  }

  async deposit(event: DepositEventDto, options: EventOptions) {
    // TODO: deposit event
    return await this.mpService.event('page_view', event, options);
  }

  async customEvents(
    events: Array<Record<string, any>>,
    options: EventOptions,
  ) {
    // TODO: custom events
    return await this.mpService.event('page_view', events[0], options);
  }
}
