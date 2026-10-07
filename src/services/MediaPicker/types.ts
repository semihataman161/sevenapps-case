import type { ImagePickerOptions, ImagePickerResult } from 'expo-image-picker';

export type PickedVideo = {
  uri: string;
  duration: number;
  width: number | null;
  height: number | null;
  fileName: string | null;
};

export type LibraryLauncher = (options: ImagePickerOptions) => Promise<ImagePickerResult>;

export type MediaPickerContract = {
  pickVideo: () => Promise<PickedVideo | null>;
};
