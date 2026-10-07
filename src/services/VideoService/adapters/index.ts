import { File } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { trimVideo } from 'expo-trim-video';
import * as VideoThumbnails from 'expo-video-thumbnails';

import type { LibraryPicker, Thumbnailer, Trimmer } from '../types';
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

export const libraryPicker: LibraryPicker = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['videos'],
    allowsEditing: false,
    quality: 1,
  });
  if (result.canceled) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    duration: (asset.duration ?? 0) / 1000,
    width: asset.width || null,
    height: asset.height || null,
    fileName: asset.fileName ?? null,
  };
};
