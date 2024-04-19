import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { EventRequestDto } from './dto/event-request.dto';
import { PageViewEventDto } from './dto/page-view-event.dto';
import { ApiEventRequestBody } from '../common/decorators/api-event-request-body.decorator';
import { FirstVisitEventDto } from './dto/first-visit-event.dto';
import { DepositEventDto } from './dto/deposit-event.dto';
import { ApiEventResponse } from '../common/decorators/api-event-response.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { GAApiSecret } from '../common/decorators/ga-api-secret.decorator';
import { GAMeasurementId } from '../common/decorators/ga-measurement-id.decorator';
import { ApiEventExceptions } from '../common/decorators/api-event-exceptions';
import { CustomEventsRequestDto } from './dto/custom-events-request.dto';
import { CampaignDetailsEventDto } from './dto/campaign-details-event.dto';
import { EventRequestValidationPipe } from '../common/pipes/event-request-validation-pipe';
import { handleExceptions } from '../common/utils/handle-exceptions';

@ApiSecurity('googleAnalyticsApiSecret')
@ApiSecurity('googleAnalyticsMeasurementId')
@ApiTags('analytics')
@UseGuards(AuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({
    description: 'Endpoint for populating the Views metric.',
    summary: 'the user viewed page / the output of the bot command',
  })
  @ApiEventExceptions()
  @ApiEventResponse()
  @ApiEventRequestBody(PageViewEventDto)
  @Post('page_view')
  async pageView(
    @GAApiSecret() apiSecret: string,
    @GAMeasurementId() measurementId: string,
    @Body(EventRequestValidationPipe(PageViewEventDto))
    eventDto: EventRequestDto<PageViewEventDto>,
  ) {
    try {
      return await this.analyticsService.pageView(eventDto.event, {
        clientId: eventDto.client_id,
        userId: eventDto.user_id,
        apiSecret,
        measurementId,
      });
    } catch (err) {
      handleExceptions(err);
    }
  }

  @ApiOperation({
    description:
      'Endpoint for collecting user scope campaign details and traffic ' +
      'sources (first user source dimension).',
    summary: 'the user started bot via /start command',
  })
  @ApiEventExceptions()
  @ApiEventResponse()
  @ApiEventRequestBody(FirstVisitEventDto)
  @Post('first_visit')
  async firstVisit(
    @GAApiSecret() apiSecret: string,
    @GAMeasurementId() measurementId: string,
    @Body(EventRequestValidationPipe(FirstVisitEventDto))
    eventDto: EventRequestDto<FirstVisitEventDto>,
  ) {
    try {
      return await this.analyticsService.firstVisit(eventDto.event, {
        clientId: eventDto.client_id,
        userId: eventDto.user_id,
        apiSecret,
        measurementId,
      });
    } catch (err) {
      handleExceptions(err);
    }
  }

  @ApiOperation({
    description:
      'Endpoint to associate particular traffic source with user sessions (session source dimension).',
    summary: 'campaign details',
  })
  @ApiEventExceptions()
  @ApiEventResponse()
  @ApiEventRequestBody(CampaignDetailsEventDto)
  @Post('campaign_details')
  async campaignDetails(
    @GAApiSecret() apiSecret: string,
    @GAMeasurementId() measurementId: string,
    @Body(EventRequestValidationPipe(CampaignDetailsEventDto))
    eventDto: EventRequestDto<CampaignDetailsEventDto>,
  ) {
    try {
      return await this.analyticsService.firstVisit(eventDto.event, {
        clientId: eventDto.client_id,
        userId: eventDto.user_id,
        apiSecret,
        measurementId,
      });
    } catch (err) {
      handleExceptions(err);
    }
  }

  @ApiOperation({
    description:
      "Endpoint for collecting information about top-ups of the user's balance.",
    summary: 'the user replenish his balance',
  })
  @ApiEventExceptions()
  @ApiEventResponse()
  @ApiEventRequestBody(DepositEventDto)
  @Post('deposit')
  async deposit(
    @GAApiSecret() apiSecret: string,
    @GAMeasurementId() measurementId: string,
    @Body(EventRequestValidationPipe(DepositEventDto))
    eventDto: EventRequestDto<DepositEventDto>,
  ) {
    try {
      return await this.analyticsService.deposit(eventDto.event, {
        clientId: eventDto.client_id,
        userId: eventDto.user_id,
        apiSecret,
        measurementId,
      });
    } catch (err) {
      handleExceptions(err);
    }
  }

  @ApiOperation({
    description: 'Endpoint for batch sending custom events.',
    summary: 'custom events',
  })
  @ApiEventExceptions()
  @ApiEventResponse()
  @Post('custom')
  async customEvents(
    @GAApiSecret() apiSecret: string,
    @GAMeasurementId() measurementId: string,
    @Body() body: CustomEventsRequestDto,
  ) {
    try {
      return await this.analyticsService.customEvents(body.events, {
        clientId: body.client_id,
        userId: body.user_id,
        apiSecret,
        measurementId,
      });
    } catch (err) {
      handleExceptions(err);
    }
  }
}
