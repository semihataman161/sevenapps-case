import type { DiaryVideo, VideoMetadata } from '@/types/video';

import { getDatabase } from './client';

type VideoRow = {
  id: string;
  name: string;
  description: string;
  file_name: string;
  thumbnail_name: string | null;
  duration: number;
  source_start: number;
  width: number | null;
  height: number | null;
  created_at: number;
  updated_at: number;
};

function fromRow(row: VideoRow): DiaryVideo {
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

export const videoRepository = {
  async getAll(): Promise<DiaryVideo[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<VideoRow>('SELECT * FROM videos ORDER BY created_at DESC');
    return rows.map(fromRow);
  },

  async insert(video: DiaryVideo): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO videos
        (id, name, description, file_name, thumbnail_name, duration, source_start, width, height, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
  },

  async updateMetadata(id: string, metadata: VideoMetadata, updatedAt: number): Promise<void> {
    const db = await getDatabase();
    const result = await db.runAsync(
      'UPDATE videos SET name = ?, description = ?, updated_at = ? WHERE id = ?',
      metadata.name,
      metadata.description,
      updatedAt,
      id,
    );
    if (result.changes === 0) throw new Error('This video no longer exists.');
  },

  async remove(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM videos WHERE id = ?', id);
  },
};
