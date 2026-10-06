import type { SQLiteDatabase } from 'expo-sqlite';

import type { UserVersionRow } from './types';

export type * from './types';

const MIGRATIONS: string[] = [
  `
  CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    file_name TEXT NOT NULL,
    thumbnail_name TEXT,
    duration REAL NOT NULL,
    source_start REAL NOT NULL DEFAULT 0,
    width INTEGER,
    height INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos (created_at DESC);
  `,
];

export async function migrate(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  const row = await db.getFirstAsync<UserVersionRow>('PRAGMA user_version');
  const current = row?.user_version ?? 0;
  if (current >= MIGRATIONS.length) return;

  await db.withExclusiveTransactionAsync(async (tx) => {
    for (let version = current; version < MIGRATIONS.length; version++) {
      await tx.execAsync(MIGRATIONS[version]);
    }
    await tx.execAsync(`PRAGMA user_version = ${MIGRATIONS.length}`);
  });
}
