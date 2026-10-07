import { VideoServiceError } from '../errors';
import type {
  PageQuery,
  SqliteConnection,
  VideoDetails,
  VideoRecord,
  VideoRepositoryContract,
} from '../types';
import { LIKE_ESCAPE, VIDEO_COLUMNS } from './constants';
import type { CountRow, FileNamesRow, VideoRow } from './types';

export type * from './types';

function escapeLike(term: string): string {
  return term.replace(/[\\%_]/g, (character) => `${LIKE_ESCAPE}${character}`);
}

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

  async getById(id: string): Promise<VideoRecord | null> {
    const db = await this.database.connection();
    const row = await db.getFirstAsync<VideoRow>(
      `SELECT ${VIDEO_COLUMNS} FROM videos WHERE id = ?`,
      id,
    );
    return row ? fromRow(row) : null;
  }

  async getPage({ limit, after, search }: PageQuery): Promise<VideoRecord[]> {
    const db = await this.database.connection();
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    const term = search?.trim();
    if (term) {
      const pattern = `%${escapeLike(term)}%`;
      conditions.push(
        `(name LIKE ? ESCAPE '${LIKE_ESCAPE}' OR description LIKE ? ESCAPE '${LIKE_ESCAPE}')`,
      );
      params.push(pattern, pattern);
    }
    if (after) {
      conditions.push('(created_at < ? OR (created_at = ? AND id < ?))');
      params.push(after.createdAt, after.createdAt, after.id);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = await db.getAllAsync<VideoRow>(
      `SELECT ${VIDEO_COLUMNS} FROM videos ${where} ORDER BY created_at DESC, id DESC LIMIT ?`,
      ...params,
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
