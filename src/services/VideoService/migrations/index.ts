export const VIDEO_MIGRATIONS: readonly string[] = [
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
  `
  DROP INDEX IF EXISTS idx_videos_created_at;
  CREATE INDEX IF NOT EXISTS idx_videos_created_at_id ON videos (created_at DESC, id DESC);
  `,
];
