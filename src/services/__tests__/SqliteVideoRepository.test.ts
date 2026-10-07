import type { SQLiteDatabase } from 'expo-sqlite';

import { VideoServiceError } from '@/services/VideoService';
import {
  SqliteVideoRepository,
  type VideoRow,
} from '@/services/VideoService/SqliteVideoRepository';
import { buildVideo } from '@/testing';

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
    getAllAsync: jest.fn(async (..._args: unknown[]): Promise<unknown[]> => []),
    getFirstAsync: jest.fn(async (..._args: unknown[]): Promise<unknown> => null),
    runAsync: jest.fn(async (..._args: unknown[]) => ({ changes: 1, lastInsertRowId: 0 })),
  };
  const repository = new SqliteVideoRepository({
    connection: async () => db as unknown as SQLiteDatabase,
  });
  return { repository, db };
}

function sqlOf(mock: jest.Mock): string {
  return String(mock.mock.calls[0][0]).replace(/\s+/g, ' ');
}

function argsOf(mock: jest.Mock): unknown[] {
  return mock.mock.calls[0].slice(1);
}

describe('SqliteVideoRepository.getPage', () => {
  it('maps rows to records using explicit columns and a stable order', async () => {
    const { repository, db } = makeRepository();
    db.getAllAsync.mockResolvedValueOnce([row]);

    const videos = await repository.getPage({ limit: 20 });

    expect(videos).toEqual([
      buildVideo({
        name: 'Sunset',
        description: 'Pier',
        thumbnailName: 'clip1.jpg',
        sourceStart: 10,
        width: 1280,
        height: 720,
        createdAt: 100,
        updatedAt: 200,
      }),
    ]);
    expect(sqlOf(db.getAllAsync)).not.toContain('SELECT *');
    expect(sqlOf(db.getAllAsync)).toContain('ORDER BY created_at DESC, id DESC LIMIT ?');
    expect(argsOf(db.getAllAsync)).toEqual([20]);
  });

  it('continues after a cursor on created time and id', async () => {
    const { repository, db } = makeRepository();

    await repository.getPage({ limit: 20, after: { createdAt: 100, id: 'clip1' } });

    expect(sqlOf(db.getAllAsync)).toContain(
      'WHERE (created_at < ? OR (created_at = ? AND id < ?))',
    );
    expect(argsOf(db.getAllAsync)).toEqual([100, 100, 'clip1', 20]);
  });

  it('searches name and description with escaped wildcards', async () => {
    const { repository, db } = makeRepository();

    await repository.getPage({ limit: 20, search: ' 50%_off ' });

    expect(sqlOf(db.getAllAsync)).toContain(
      "WHERE (name LIKE ? ESCAPE '\\' OR description LIKE ? ESCAPE '\\')",
    );
    expect(argsOf(db.getAllAsync)).toEqual(['%50\\%\\_off%', '%50\\%\\_off%', 20]);
  });

  it('combines a search with a cursor', async () => {
    const { repository, db } = makeRepository();

    await repository.getPage({ limit: 20, search: 'sea', after: { createdAt: 100, id: 'clip1' } });

    expect(sqlOf(db.getAllAsync)).toContain(') AND (created_at < ?');
    expect(argsOf(db.getAllAsync)).toEqual(['%sea%', '%sea%', 100, 100, 'clip1', 20]);
  });

  it('ignores a blank search', async () => {
    const { repository, db } = makeRepository();

    await repository.getPage({ limit: 20, search: '   ' });

    expect(sqlOf(db.getAllAsync)).not.toContain('LIKE');
  });
});

describe('SqliteVideoRepository.getById', () => {
  it('finds a record by id', async () => {
    const { repository, db } = makeRepository();
    db.getFirstAsync.mockResolvedValueOnce(row);

    const video = await repository.getById('clip1');

    expect(video).toMatchObject({ id: 'clip1', fileName: 'clip1.mp4' });
    expect(sqlOf(db.getFirstAsync)).toContain('FROM videos WHERE id = ?');
    expect(argsOf(db.getFirstAsync)).toEqual(['clip1']);
  });

  it('returns null for an unknown id', async () => {
    const { repository } = makeRepository();

    await expect(repository.getById('missing')).resolves.toBeNull();
  });
});

describe('SqliteVideoRepository.getFileNames', () => {
  it('lists every video and poster file', async () => {
    const { repository, db } = makeRepository();
    db.getAllAsync.mockResolvedValueOnce([
      { file_name: 'a.mp4', thumbnail_name: 'a.jpg' },
      { file_name: 'b.mp4', thumbnail_name: null },
    ]);

    await expect(repository.getFileNames()).resolves.toEqual(['a.mp4', 'a.jpg', 'b.mp4']);
  });
});

describe('SqliteVideoRepository writes', () => {
  it('inserts every column in order', async () => {
    const { repository, db } = makeRepository();

    await repository.insert(
      buildVideo({
        name: 'Sunset',
        description: 'Pier',
        sourceStart: 10,
        createdAt: 100,
        updatedAt: 100,
      }),
    );

    expect(argsOf(db.runAsync)).toEqual([
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

  it('updates the name, description and update time of one record', async () => {
    const { repository, db } = makeRepository();

    await repository.updateDetails('clip1', { name: 'New', description: 'Text' }, 50);

    expect(sqlOf(db.runAsync)).toContain(
      'UPDATE videos SET name = ?, description = ?, updated_at = ? WHERE id = ?',
    );
    expect(argsOf(db.runAsync)).toEqual(['New', 'Text', 50, 'clip1']);
  });

  it('throws notFound when no record was updated', async () => {
    const { repository, db } = makeRepository();
    db.runAsync.mockResolvedValueOnce({ changes: 0, lastInsertRowId: 0 });

    const update = repository.updateDetails('gone', { name: 'X', description: '' }, 1);

    await expect(update).rejects.toBeInstanceOf(VideoServiceError);
    await expect(update).rejects.toMatchObject({ code: 'notFound' });
  });
});
