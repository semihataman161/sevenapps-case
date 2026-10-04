export type DiaryVideo = {
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

export type VideoMetadata = Pick<DiaryVideo, 'name' | 'description'>;

export type SourceVideo = {
  uri: string;
  duration: number;
  width: number | null;
  height: number | null;
  fileName: string | null;
};
