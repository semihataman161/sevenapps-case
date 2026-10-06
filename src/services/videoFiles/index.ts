import { Directory, File, Paths } from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';

const videosDir = new Directory(Paths.document, 'videos');
const thumbnailsDir = new Directory(Paths.document, 'thumbnails');

function ensureDir(dir: Directory) {
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
}

export function videoUri(fileName: string): string {
  return new File(videosDir, fileName).uri;
}

export function thumbnailUri(fileName: string | null): string | null {
  return fileName ? new File(thumbnailsDir, fileName).uri : null;
}

export async function persistClip(tempUri: string, id: string): Promise<string> {
  ensureDir(videosDir);
  const fileName = `${id}.mp4`;
  await new File(tempUri).move(new File(videosDir, fileName), { overwrite: true });
  return fileName;
}

export async function createThumbnail(clipUri: string, id: string): Promise<string | null> {
  try {
    ensureDir(thumbnailsDir);
    const { uri } = await VideoThumbnails.getThumbnailAsync(clipUri, { time: 0, quality: 0.7 });
    const fileName = `${id}.jpg`;
    await new File(uri).move(new File(thumbnailsDir, fileName), { overwrite: true });
    return fileName;
  } catch (error) {
    console.warn('Thumbnail generation failed', error);
    return null;
  }
}

export function deleteFiles(fileName: string, thumbnailName: string | null): void {
  for (const file of [
    new File(videosDir, fileName),
    thumbnailName ? new File(thumbnailsDir, thumbnailName) : null,
  ]) {
    try {
      if (file?.exists) file.delete();
    } catch (error) {
      console.warn('Failed to delete file', file?.uri, error);
    }
  }
}
