import { HttpServiceError } from '../errors/http-service-error';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as util from 'node:util';

export const handleExceptions = (error: Error) => {
  if (error instanceof HttpServiceError) {
    Logger.error(util.inspect(error, false, 2, true), error.serviceName);
    throw new HttpException(
      `Error while requesting external service: ${error.message}`,
      HttpStatus.BAD_REQUEST,
      { cause: error },
    );
  }

  throw error;
};
