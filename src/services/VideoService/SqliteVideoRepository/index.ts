import { VideoServiceError } from '../errors';
import type {
  PageQuery,
  SqliteConnection,
  VideoDetails,
  VideoRecord,
  VideoRepositoryContract,
} from '../types';
import { VIDEO_COLUMNS } from './constants';
import type { CountRow, FileNamesRow, VideoRow } from './types';

export type * from './types';

function fromRow(row: VideoRow): VideoRecord {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    fileName: row.file_name,
    thumbnailName: row.thumbnail_name,
    duration: row.duration,
    sourceStart: row.source_start,
    width: row.width,
    height: row.height,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class SqliteVideoRepository implements VideoRepositoryContract {
  constructor(private readonly database: SqliteConnection) {}

  async count(): Promise<number> {
    const db = await this.database.connection();
    const row = await db.getFirstAsync<CountRow>('SELECT COUNT(*) AS total FROM videos');
    return row?.total ?? 0;
  }

  async getPage({ limit, after }: PageQuery): Promise<VideoRecord[]> {
    const db = await this.database.connection();
    const rows = after
      ? await db.getAllAsync<VideoRow>(
          `SELECT ${VIDEO_COLUMNS} FROM videos
           WHERE created_at < ? OR (created_at = ? AND id < ?)
           ORDER BY created_at DESC, id DESC
           LIMIT ?`,
          after.createdAt,
          after.createdAt,
          after.id,
          limit,
        )
      : await db.getAllAsync<VideoRow>(
          `SELECT ${VIDEO_COLUMNS} FROM videos ORDER BY created_at DESC, id DESC LIMIT ?`,
          limit,
        );
    return rows.map(fromRow);
  }

  async getFileNames(): Promise<string[]> {
    const db = await this.database.connection();
    const rows = await db.getAllAsync<FileNamesRow>('SELECT file_name, thumbnail_name FROM videos');
    return rows.flatMap((row) =>
      row.thumbnail_name ? [row.file_name, row.thumbnail_name] : [row.file_name],
    );
  }

  async insert(video: VideoRecord): Promise<void> {
    const db = await this.database.connection();
    await db.runAsync(
      `INSERT INTO videos (${VIDEO_COLUMNS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      video.id,
      video.name,
      video.description,
      video.fileName,
      video.thumbnailName,
      video.duration,
      video.sourceStart,
      video.width,
      video.height,
      video.createdAt,
      video.updatedAt,
    );
  }

  async updateDetails(id: string, details: VideoDetails, updatedAt: number): Promise<void> {
    const db = await this.database.connection();
    const result = await db.runAsync(
      'UPDATE videos SET name = ?, description = ?, updated_at = ? WHERE id = ?',
      details.name,
      details.description,
      updatedAt,
      id,
    );
    if (result.changes === 0) throw new VideoServiceError('notFound');
  }

  async remove(id: string): Promise<void> {
    const db = await this.database.connection();
    await db.runAsync('DELETE FROM videos WHERE id = ?', id);
  }
}
