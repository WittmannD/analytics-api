import { HttpServiceError } from '../errors/http-service-error';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { inspectObject } from './log';

export const handleExceptions = (error: Error) => {
  if (error instanceof HttpServiceError) {
    Logger.error(
      `Error while requesting external service: ${inspectObject(error)}`,
      error.serviceName,
    );
    throw new HttpException(
      `Error while requesting external service: ${error.message}`,
      HttpStatus.BAD_REQUEST,
      { cause: error },
    );
  }

  throw error;
};
