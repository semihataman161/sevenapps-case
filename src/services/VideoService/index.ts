import { THUMBNAIL_EXTENSION, VIDEO_EXTENSION } from './constants';
import type {
  CropRequest,
  DetailsUpdate,
  PageQuery,
  VideoDetails,
  VideoPage,
  VideoRecord,
  VideoServiceDependencies,
} from './types';

export type * from './types';
export { videoErrorCode, VideoServiceError } from './errors';

function defaultId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function cleanDetails(details: VideoDetails): VideoDetails {
  return { name: details.name.trim(), description: details.description.trim() };
}

export class VideoService {
  private readonly createId: () => string;
  private readonly now: () => number;

  constructor(private readonly deps: VideoServiceDependencies) {
    this.createId = deps.createId ?? defaultId;
    this.now = deps.now ?? Date.now;
  }

  count(): Promise<number> {
    return this.deps.repository.count();
  }

  get(id: string): Promise<VideoRecord | null> {
    return this.deps.repository.getById(id);
  }

  async listPage({ limit, after = null, search }: PageQuery): Promise<VideoPage> {
    const rows = await this.deps.repository.getPage({ limit: limit + 1, after, search });
    const videos = rows.slice(0, limit);
    const last = videos[videos.length - 1];
    const nextCursor =
      rows.length > limit && last ? { createdAt: last.createdAt, id: last.id } : null;
    return { videos, nextCursor };
  }

  async removeOrphanedFiles(): Promise<number> {
    const referenced = new Set(await this.deps.repository.getFileNames());
    let removed = 0;
    for (const storage of [this.deps.videos, this.deps.thumbnails]) {
      for (const fileName of storage.list()) {
        if (referenced.has(fileName)) continue;
        storage.remove(fileName);
        removed += 1;
      }
    }
    return removed;
  }

  async crop({ source, range, details }: CropRequest): Promise<VideoRecord> {
    const trimmed = await this.deps.trimmer({
      uri: source.uri,
      start: range.start,
      end: range.end,
    });

    const id = this.createId();
    const fileName = await this.deps.videos.moveIn(trimmed.uri, `${id}.${VIDEO_EXTENSION}`);
    const thumbnailName = await this.createThumbnail(this.deps.videos.uri(fileName), id);

    const createdAt = this.now();
    const video: VideoRecord = {
      id,
      ...cleanDetails(details),
      fileName,
      thumbnailName,
      duration: range.end - range.start,
      sourceStart: range.start,
      width: source.width,
      height: source.height,
      createdAt,
      updatedAt: createdAt,
    };

    try {
      await this.deps.repository.insert(video);
    } catch (error) {
      this.removeFiles(video);
      throw error;
    }
    return video;
  }

  async updateDetails(id: string, details: VideoDetails): Promise<DetailsUpdate> {
    const clean = cleanDetails(details);
    const updatedAt = this.now();
    await this.deps.repository.updateDetails(id, clean, updatedAt);
    return { details: clean, updatedAt };
  }

  async delete(video: VideoRecord): Promise<void> {
    await this.deps.repository.remove(video.id);
    this.removeFiles(video);
  }

  videoUri(fileName: string): string {
    return this.deps.videos.uri(fileName);
  }

  thumbnailUri(fileName: string | null): string | null {
    return fileName ? this.deps.thumbnails.uri(fileName) : null;
  }

  private async createThumbnail(clipUri: string, id: string): Promise<string | null> {
    try {
      const { uri } = await this.deps.thumbnailer(clipUri);
      return await this.deps.thumbnails.moveIn(uri, `${id}.${THUMBNAIL_EXTENSION}`);
    } catch (error) {
      console.warn('Thumbnail generation failed', error);
      return null;
    }
  }

  private removeFiles(video: VideoRecord): void {
    this.deps.videos.remove(video.fileName);
    if (video.thumbnailName) this.deps.thumbnails.remove(video.thumbnailName);
  }
}
