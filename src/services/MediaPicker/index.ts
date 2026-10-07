import { launchImageLibraryAsync } from 'expo-image-picker';

import type { LibraryLauncher, MediaPickerContract, PickedVideo } from './types';

export type * from './types';

export class MediaPicker implements MediaPickerContract {
  constructor(private readonly launch: LibraryLauncher = launchImageLibraryAsync) {}

  async pickVideo(): Promise<PickedVideo | null> {
    const result = await this.launch({ mediaTypes: ['videos'], allowsEditing: false, quality: 1 });
    if (result.canceled) return null;

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      duration: (asset.duration ?? 0) / 1000,
      width: asset.width || null,
      height: asset.height || null,
      fileName: asset.fileName ?? null,
    };
  }
}
