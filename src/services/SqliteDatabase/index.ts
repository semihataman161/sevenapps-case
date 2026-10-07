import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import type { SqliteDatabaseConnection, SqliteDatabaseOptions, UserVersionRow } from './types';

export type * from './types';

export class SqliteDatabase implements SqliteDatabaseConnection {
  private ready: Promise<SQLiteDatabase> | null = null;

  constructor(private readonly options: SqliteDatabaseOptions) {}

  connection(): Promise<SQLiteDatabase> {
    if (!this.ready) {
      this.ready = this.open();
      this.ready.catch(() => {
        this.ready = null;
      });
    }
    return this.ready;
  }

  private async open(): Promise<SQLiteDatabase> {
    const open = this.options.open ?? openDatabaseAsync;
    const database = await open(this.options.name);
    await this.migrate(database);
    return database;
  }

  private async migrate(database: SQLiteDatabase): Promise<void> {
    const { migrations } = this.options;
    await database.execAsync('PRAGMA journal_mode = WAL;');
    const row = await database.getFirstAsync<UserVersionRow>('PRAGMA user_version');
    const current = row?.user_version ?? 0;
    if (current >= migrations.length) return;

    await database.withExclusiveTransactionAsync(async (transaction) => {
      for (let version = current; version < migrations.length; version++) {
        await transaction.execAsync(migrations[version]);
      }
      await transaction.execAsync(`PRAGMA user_version = ${migrations.length}`);
    });
  }
}
