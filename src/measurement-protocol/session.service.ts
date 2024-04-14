import { Inject, Injectable } from '@nestjs/common';
import { subMinutes } from 'date-fns';
import { MEASUREMENT_PROTOCOL_SESSION_STORAGE } from './constants';
import { SessionData, SessionIdStorage } from './storage/session-id-storage';

@Injectable()
export class SessionService {
  constructor(
    @Inject(MEASUREMENT_PROTOCOL_SESSION_STORAGE)
    private readonly sessionStorage: SessionIdStorage,
  ) {}

  async getOrCreate(clientId: string, config: any) {
    const session = await this.sessionStorage.get(clientId);

    if (
      !session ||
      session.lastOperationAt <
        subMinutes(new Date(), config.sessionExpirationInMin)
    ) {
      const sessionId = Date.now();
      await this.sessionStorage.put(clientId, sessionId);

      return {
        sessionId,
        lastOperationAt: new Date(),
      };
    }

    return session;
  }

  async update(clientId: string, data: SessionData) {
    await this.sessionStorage?.onOperation?.(clientId, data);
  }
}
