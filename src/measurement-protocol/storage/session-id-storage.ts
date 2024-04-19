export interface SessionData {
  sessionId: number;
  lastOperationAt: Date;
  [index: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface SessionIdStorage {
  initialize?(): Promise<void> | void;
  onOperation?(clientId: string, data: SessionData): Promise<void> | void;
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export abstract class SessionIdStorage {
  abstract get(
    clientId: string,
  ): Promise<SessionData | undefined> | SessionData | undefined;
  abstract put(clientId: string, sessionId: number): Promise<void> | void;
  abstract delete(clientId: string, sessionId: number): Promise<void> | void;
}
