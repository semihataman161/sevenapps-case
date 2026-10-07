import { SqliteDatabase } from '../SqliteDatabase';
import { FileStorage } from '../FileStorage';
import { KeyValueStorage } from '../KeyValueStorage';
import { VideoService } from '../VideoService';
import { expoThumbnailer, expoTrimmer, libraryPicker } from '../VideoService/adapters';
import { VIDEO_MIGRATIONS } from '../VideoService/migrations';
import { SqliteVideoRepository } from '../VideoService/SqliteVideoRepository';

const DATABASE_NAME = 'video-diary.db';

const database = new SqliteDatabase({ name: DATABASE_NAME, migrations: VIDEO_MIGRATIONS });

export const videoService = new VideoService({
  repository: new SqliteVideoRepository(database),
  videos: new FileStorage('videos'),
  thumbnails: new FileStorage('thumbnails'),
  trimmer: expoTrimmer,
  thumbnailer: expoThumbnailer,
  picker: libraryPicker,
});

export const keyValueStorage = new KeyValueStorage();
