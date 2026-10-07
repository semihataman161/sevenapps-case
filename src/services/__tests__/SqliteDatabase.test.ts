import type { SQLiteDatabase } from 'expo-sqlite';

import { SqliteDatabase } from '@/services/SqliteDatabase';

function makeSqlite(userVersion: number) {
  const executed: string[] = [];
  const db = {
    execAsync: jest.fn(async (sql: string) => {
      executed.push(sql.trim());
    }),
    getFirstAsync: jest.fn(async () => ({ user_version: userVersion })),
    withExclusiveTransactionAsync: jest.fn(async (task: (tx: unknown) => Promise<void>) => {
      await task(db);
    }),
  };
  return { db: db as unknown as SQLiteDatabase, executed };
}

describe('SqliteDatabase', () => {
  it('runs pending migrations and bumps the user version', async () => {
    const { db, executed } = makeSqlite(1);
    const database = new SqliteDatabase({
      name: 'test.db',
      migrations: ['A', 'B', 'C'],
      open: () => db,
    });

    await database.connection();
    expect(executed).toEqual(['PRAGMA journal_mode = WAL;', 'B', 'C', 'PRAGMA user_version = 3']);
  });

  it('skips migrations when the schema is current', async () => {
    const { db, executed } = makeSqlite(2);
    const database = new SqliteDatabase({
      name: 'test.db',
      migrations: ['A', 'B'],
      open: () => db,
    });

    await database.connection();
    expect(executed).toEqual(['PRAGMA journal_mode = WAL;']);
  });

  it('opens the database only once', async () => {
    const { db } = makeSqlite(0);
    const open = jest.fn(() => db);
    const database = new SqliteDatabase({ name: 'test.db', migrations: [], open });

    await Promise.all([database.connection(), database.connection()]);
    expect(open).toHaveBeenCalledTimes(1);
  });
});
