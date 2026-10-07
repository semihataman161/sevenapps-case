import type { SQLiteDatabase } from 'expo-sqlite';

export type SqliteDatabaseOptions = {
  name: string;
  migrations: readonly string[];
  open?: (name: string) => Promise<SQLiteDatabase> | SQLiteDatabase;
};

export type SqliteDatabaseConnection = {
  connection: () => Promise<SQLiteDatabase>;
};

export type UserVersionRow = {
  user_version: number;
};
