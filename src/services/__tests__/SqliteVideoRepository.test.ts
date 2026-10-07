import type { SQLiteDatabase } from 'expo-sqlite';

import { VideoServiceError } from '@/services/VideoService';
import { SqliteVideoRepository } from '@/services/VideoService/SqliteVideoRepository';
import type { VideoRow } from '@/services/VideoService/SqliteVideoRepository';

const row: VideoRow = {
  id: 'clip1',
  name: 'Sunset',
  description: 'Pier',
  file_name: 'clip1.mp4',
  thumbnail_name: 'clip1.jpg',
  duration: 5,
  source_start: 10,
  width: 1280,
  height: 720,
  created_at: 100,
  updated_at: 200,
};

function makeRepository() {
  const db = {
    getAllAsync: jest.fn(async (): Promise<unknown[]> => []),
    getFirstAsync: jest.fn(async (): Promise<unknown> => null),
    runAsync: jest.fn(async () => ({ changes: 1, lastInsertRowId: 0 })),
  };
  const repository = new SqliteVideoRepository({
    connection: async () => db as unknown as SQLiteDatabase,
  });
  return { repository, db };
}

const sqlOf = (mock: jest.Mock) => String(mock.mock.calls[0][0]).replace(/\s+/g, ' ');

describe('SqliteVideoRepository', () => {
  it('maps rows to records and selects explicit columns', async () => {
    const { repository, db } = makeRepository();
    db.getAllAsync.mockResolvedValueOnce([row]);

    await expect(repository.getPage({ limit: 20 })).resolves.toEqual([
      {
        id: 'clip1',
        name: 'Sunset',
        description: 'Pier',
        fileName: 'clip1.mp4',
        thumbnailName: 'clip1.jpg',
        duration: 5,
        sourceStart: 10,
        width: 1280,
        height: 720,
        createdAt: 100,
        updatedAt: 200,
      },
    ]);
    expect(sqlOf(db.getAllAsync)).not.toContain('SELECT *');
    expect(sqlOf(db.getAllAsync)).toContain('ORDER BY created_at DESC, id DESC LIMIT ?');
    expect(db.getAllAsync.mock.calls[0].slice(1)).toEqual([20]);
  });

  it('pages after a cursor with a stable order', async () => {
    const { repository, db } = makeRepository();
    await repository.getPage({ limit: 20, after: { createdAt: 100, id: 'clip1' } });

    expect(sqlOf(db.getAllAsync)).toContain('WHERE created_at < ? OR (created_at = ? AND id < ?)');
    expect(db.getAllAsync.mock.calls[0].slice(1)).toEqual([100, 100, 'clip1', 20]);
  });

  it('counts records', async () => {
    const { repository, db } = makeRepository();
    db.getFirstAsync.mockResolvedValueOnce({ total: 3 });
    await expect(repository.count()).resolves.toBe(3);
  });

  it('lists every stored file name', async () => {
    const { repository, db } = makeRepository();
    db.getAllAsync.mockResolvedValueOnce([
      { file_name: 'a.mp4', thumbnail_name: 'a.jpg' },
      { file_name: 'b.mp4', thumbnail_name: null },
    ]);
    await expect(repository.getFileNames()).resolves.toEqual(['a.mp4', 'a.jpg', 'b.mp4']);
  });

  it('inserts every column in order', async () => {
    const { repository, db } = makeRepository();
    await repository.insert({
      id: 'clip1',
      name: 'Sunset',
      description: 'Pier',
      fileName: 'clip1.mp4',
      thumbnailName: null,
      duration: 5,
      sourceStart: 10,
      width: null,
      height: null,
      createdAt: 100,
      updatedAt: 100,
    });
    expect(db.runAsync.mock.calls[0].slice(1)).toEqual([
      'clip1',
      'Sunset',
      'Pier',
      'clip1.mp4',
      null,
      5,
      10,
      null,
      null,
      100,
      100,
    ]);
  });

  it('throws a notFound error when updating a missing record', async () => {
    const { repository, db } = makeRepository();
    db.runAsync.mockResolvedValueOnce({ changes: 0, lastInsertRowId: 0 });

    const update = repository.updateDetails('gone', { name: 'X', description: '' }, 1);
    await expect(update).rejects.toBeInstanceOf(VideoServiceError);
    await expect(update).rejects.toMatchObject({ code: 'notFound' });
  });
});
