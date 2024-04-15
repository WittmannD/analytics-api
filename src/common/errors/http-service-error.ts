import { ServiceError } from './service-error';
import { HttpService } from '@nestjs/axios';

export class HttpServiceError extends ServiceError {
  constructor(
    message: string,
    readonly request?: any,
    readonly response?: any,
  ) {
    super(message, HttpService);
    Object.setPrototypeOf(this, HttpServiceError.prototype);
  }
}
