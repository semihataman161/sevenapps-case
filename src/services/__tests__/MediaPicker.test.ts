import type { ImagePickerAsset, ImagePickerResult } from 'expo-image-picker';

import { MediaPicker } from '@/services/MediaPicker';

function pickerReturning(result: ImagePickerResult) {
  const launch = jest.fn(async () => result);
  return { picker: new MediaPicker(launch), launch };
}

function picked(asset: Partial<ImagePickerAsset>): ImagePickerResult {
  return { canceled: false, assets: [{ uri: 'file:///a.mov', width: 0, height: 0, ...asset }] };
}

describe('MediaPicker.pickVideo', () => {
  it('opens the library for a single unedited video', async () => {
    const { picker, launch } = pickerReturning(picked({}));

    await picker.pickVideo();

    expect(launch).toHaveBeenCalledWith({
      mediaTypes: ['videos'],
      allowsEditing: false,
      quality: 1,
    });
  });

  it('converts the duration to seconds and keeps the metadata', async () => {
    const { picker } = pickerReturning(
      picked({ duration: 12500, width: 1920, height: 1080, fileName: 'a.mov' }),
    );

    await expect(picker.pickVideo()).resolves.toEqual({
      uri: 'file:///a.mov',
      duration: 12.5,
      width: 1920,
      height: 1080,
      fileName: 'a.mov',
    });
  });

  it('fills unknown metadata with null and a zero duration', async () => {
    const { picker } = pickerReturning(picked({}));

    await expect(picker.pickVideo()).resolves.toEqual({
      uri: 'file:///a.mov',
      duration: 0,
      width: null,
      height: null,
      fileName: null,
    });
  });

  it('returns null when the user cancels', async () => {
    const { picker } = pickerReturning({ canceled: true, assets: null });

    await expect(picker.pickVideo()).resolves.toBeNull();
  });
});
