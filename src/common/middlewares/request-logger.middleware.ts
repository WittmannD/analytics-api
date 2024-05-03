import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const statusCode = res.statusCode;
      if (
        statusCode === HttpStatus.BAD_REQUEST ||
        statusCode === HttpStatus.FORBIDDEN ||
        statusCode === HttpStatus.UNAUTHORIZED ||
        statusCode === HttpStatus.INTERNAL_SERVER_ERROR
      ) {
        this.logger.warn(`[${req.method}] ${req.url} - ${statusCode}`);
      }
    });

    next();
  }
}
