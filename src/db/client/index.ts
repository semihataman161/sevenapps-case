import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';

import { migrate } from '../migrations';

const DATABASE_NAME = 'video-diary.db';

let database: SQLiteDatabase | null = null;
let ready: Promise<SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLiteDatabase> {
  if (!ready) {
    ready = (async () => {
      database = openDatabaseSync(DATABASE_NAME);
      await migrate(database);
      return database;
    })();
    ready.catch(() => {
      ready = null;
    });
  }
  return ready;
}
