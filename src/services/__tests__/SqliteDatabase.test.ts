import type { SQLiteDatabase } from 'expo-sqlite';

import { SqliteDatabase } from '@/services/SqliteDatabase';

function fakeSqlite(userVersion: number) {
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
  return { db, sqlite: db as unknown as SQLiteDatabase, executed };
}

function createDatabase(migrations: string[], open: () => SQLiteDatabase) {
  return new SqliteDatabase({ name: 'test.db', migrations, open });
}

describe('SqliteDatabase', () => {
  it('runs pending migrations in one transaction and bumps the user version', async () => {
    const { db, sqlite, executed } = fakeSqlite(1);
    const database = createDatabase(['A', 'B', 'C'], () => sqlite);

    await database.connection();

    expect(executed).toEqual(['PRAGMA journal_mode = WAL;', 'B', 'C', 'PRAGMA user_version = 3']);
    expect(db.withExclusiveTransactionAsync).toHaveBeenCalledTimes(1);
  });

  it('skips migrations when the schema is up to date', async () => {
    const { db, sqlite, executed } = fakeSqlite(2);
    const database = createDatabase(['A', 'B'], () => sqlite);

    await database.connection();

    expect(executed).toEqual(['PRAGMA journal_mode = WAL;']);
    expect(db.withExclusiveTransactionAsync).not.toHaveBeenCalled();
  });

  it('opens the database once for concurrent callers', async () => {
    const { sqlite } = fakeSqlite(0);
    const open = jest.fn(() => sqlite);
    const database = createDatabase([], open);

    await Promise.all([database.connection(), database.connection()]);

    expect(open).toHaveBeenCalledTimes(1);
  });

  it('tries to open again after a failed attempt', async () => {
    const { sqlite } = fakeSqlite(0);
    const open = jest
      .fn<SQLiteDatabase, []>()
      .mockImplementationOnce(() => {
        throw new Error('locked');
      })
      .mockReturnValue(sqlite);
    const database = createDatabase([], open);

    await expect(database.connection()).rejects.toThrow('locked');
    await expect(database.connection()).resolves.toBe(sqlite);
    expect(open).toHaveBeenCalledTimes(2);
  });
});
