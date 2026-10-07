import type { SQLiteDatabase } from 'expo-sqlite';

export type VideoRecord = {
  id: string;
  name: string;
  description: string;
  fileName: string;
  thumbnailName: string | null;
  duration: number;
  sourceStart: number;
  width: number | null;
  height: number | null;
  createdAt: number;
  updatedAt: number;
};

export type VideoDetails = Pick<VideoRecord, 'name' | 'description'>;

export type VideoSource = {
  uri: string;
  duration: number;
  width: number | null;
  height: number | null;
  fileName: string | null;
};

export type TimeRange = {
  start: number;
  end: number;
};

export type CropRequest = {
  source: VideoSource;
  range: TimeRange;
  details: VideoDetails;
};

export type DetailsUpdate = {
  details: VideoDetails;
  updatedAt: number;
};

export type VideoErrorCode = 'rangeOutOfBounds' | 'sourceUnreadable' | 'notFound' | 'unknown';

export type PageCursor = Pick<VideoRecord, 'createdAt' | 'id'>;

export type PageQuery = {
  limit: number;
  after?: PageCursor | null;
  search?: string;
};

export type VideoPage = {
  videos: VideoRecord[];
  nextCursor: PageCursor | null;
};

export type VideoRepositoryContract = {
  count: () => Promise<number>;
  getById: (id: string) => Promise<VideoRecord | null>;
  getPage: (query: PageQuery) => Promise<VideoRecord[]>;
  getFileNames: () => Promise<string[]>;
  insert: (video: VideoRecord) => Promise<void>;
  updateDetails: (id: string, details: VideoDetails, updatedAt: number) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export type Trimmer = (input: {
  uri: string;
  start: number;
  end: number;
}) => Promise<{ uri: string }>;

export type Thumbnailer = (uri: string) => Promise<{ uri: string }>;

export type FileStore = {
  list: () => string[];
  uri: (fileName: string) => string;
  moveIn: (sourceUri: string, fileName: string) => Promise<string>;
  remove: (fileName: string) => void;
};

export type SqliteConnection = {
  connection: () => Promise<SQLiteDatabase>;
};

export type VideoServiceDependencies = {
  repository: VideoRepositoryContract;
  videos: FileStore;
  thumbnails: FileStore;
  trimmer: Trimmer;
  thumbnailer: Thumbnailer;
  createId?: () => string;
  now?: () => number;
};
