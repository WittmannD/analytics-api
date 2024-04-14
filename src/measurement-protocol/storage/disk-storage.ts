import { SessionData, SessionIdStorage } from './session-id-storage';
import { open } from 'sqlite';
import * as sqlite3 from 'sqlite3';


export interface SessionEntity extends SessionData {
  clientId: string;
  sessionId: number;
  lastOperationAt: Date;
}

export class DiskStorage extends SessionIdStorage {
  private withDBConnection = async function* () {
    const db = await open({
      filename: 'sessions.sqlite',
      driver: sqlite3.Database,
    });

    try {
      yield db;
    } finally {
      await db.close();
    }
  };

  async initialize(): Promise<void> {
    for await (const db of this.withDBConnection()) {
      await db.exec(
        `CREATE TABLE IF NOT EXISTS session (
  clientId VARCHAR(255),
  sessionId BIGINT,
  lastOperationAt DATETIME,
  PRIMARY KEY (clientId, sessionId)
);`,
      );
    }
  }

  async get(clientId: string): Promise<SessionEntity | undefined> {
    for await (const db of this.withDBConnection()) {
      return await db.get<SessionEntity>(
        'SELECT * FROM session WHERE clientId = :clientId ORDER BY lastOperationAt;',
        {
          ':clientId': clientId,
        },
      );
    }
  }

  async put(clientId: string, sessionId: number) {
    for await (const db of this.withDBConnection()) {
      await db.run(
        `INSERT INTO session (clientId, sessionId, lastOperationAt) VALUES (:clientId, :sessionId, :lastOperationAt);`,
        {
          ':clientId': clientId,
          ':sessionId': sessionId,
          ':lastOperationAt': new Date(),
        },
      );
    }
  }

  async onOperation(clientId: string, data: SessionData) {
    for await (const db of this.withDBConnection()) {
      await db.run(
        `UPDATE session SET lastOperationAt = :lastOperationAt WHERE clientId = :clientId AND sessionId = :sessionId`,
        {
          ':clientId': clientId,
          ':sessionId': data.sessionId,
          ':lastOperationAt': new Date(),
        },
      );
    }
  }
}
