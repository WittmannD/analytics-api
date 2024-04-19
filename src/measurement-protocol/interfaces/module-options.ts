import { SessionIdStorage } from '../storage/session-id-storage';
import { Type } from '@nestjs/common';

export interface ModuleOptions {
  measurementId: string;
  apiSecret: string;
  storage: Type<SessionIdStorage>;
  debug?: boolean;
  sessionExpirationInMin?: number;
  defaultEngagementTimeMsec?: number;
}
