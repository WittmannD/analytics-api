export interface ModuleOptions {
  measurementId: string;
  apiSecret: string;
  debug?: boolean;
  sessionExpirationInMin?: number;
  defaultEngagementTimeMsec?: number;
}
