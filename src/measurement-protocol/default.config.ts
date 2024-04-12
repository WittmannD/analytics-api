import * as _ from 'lodash';
import { ModuleOptions } from './interfaces';

type GetOptional<T> = {
  [K in keyof T as Record<any, any> extends Pick<T, K> ? K : never]-?: T[K];
};

export const DefaultConfig: GetOptional<ModuleOptions> = {
  debug: false,
  sessionExpirationInMin: 30,
  defaultEngagementTimeMsec: 100,
};

export const fillOptions = (options: ModuleOptions): ModuleOptions =>
  _.defaultsDeep(options, DefaultConfig);
