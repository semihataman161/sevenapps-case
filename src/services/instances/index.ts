import { createSettingsStore, createVideoStore } from '@/stores';

import { FileStorage } from '../FileStorage';
import { KeyValueStorage } from '../KeyValueStorage';
import { MediaPicker } from '../MediaPicker';
import { SqliteDatabase } from '../SqliteDatabase';
import { VideoService } from '../VideoService';
import { expoThumbnailer, expoTrimmer } from '../VideoService/adapters';
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
});

export const mediaPicker = new MediaPicker();

export const keyValueStorage = new KeyValueStorage();

export const useVideoStore = createVideoStore(videoService);

export const useSettingsStore = createSettingsStore(keyValueStorage);
