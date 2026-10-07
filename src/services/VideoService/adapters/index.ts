import { File } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { trimVideo } from 'expo-trim-video';
import * as VideoThumbnails from 'expo-video-thumbnails';

import type { Thumbnailer, Trimmer } from '../types';
import { POSTER_QUALITY, POSTER_WIDTH } from './constants';

function deleteQuietly(uri: string): void {
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {}
}

export const expoTrimmer: Trimmer = (input) => trimVideo(input);

export const expoThumbnailer: Thumbnailer = async (uri) => {
  const frame = await VideoThumbnails.getThumbnailAsync(uri, { time: 0, quality: 1 });
  try {
    const image = await ImageManipulator.manipulate(frame.uri)
      .resize({ width: POSTER_WIDTH })
      .renderAsync();
    const poster = await image.saveAsync({ compress: POSTER_QUALITY, format: SaveFormat.JPEG });
    return { uri: poster.uri };
  } finally {
    deleteQuietly(frame.uri);
  }
};
