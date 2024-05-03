import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { WinstonLoggerServiceFactory } from './common/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonLoggerServiceFactory('AnalyticsApp'),
  });
  app.setGlobalPrefix('api/v1');

  const document = SwaggerModule.createDocument(app, {
    openapi: '3.1.0',
    info: {
      title: 'Telegram Bot Google Analytics API',
      version: 'v1',
      description: 'API for handling and sending events to google analytics',
      contact: {},
    },
    components: {
      securitySchemes: {
        googleAnalyticsApiSecret: {
          type: 'apiKey',
          name: 'X-GA-API-SECRET',
          in: 'header',
        },
        googleAnalyticsMeasurementId: {
          type: 'apiKey',
          name: 'ga_measurement_id',
          in: 'query',
        },
      },
    },
  });
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: {
      defaultModelRendering: 'model',
    },
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
