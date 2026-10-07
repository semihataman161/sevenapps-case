import * as ImagePicker from 'expo-image-picker';
import { trimVideo } from 'expo-trim-video';
import * as VideoThumbnails from 'expo-video-thumbnails';

import type { LibraryPicker, Thumbnailer, Trimmer } from '../types';

export const expoTrimmer: Trimmer = (input) => trimVideo(input);

export const expoThumbnailer: Thumbnailer = (uri) =>
  VideoThumbnails.getThumbnailAsync(uri, { time: 0, quality: 0.7 });

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
