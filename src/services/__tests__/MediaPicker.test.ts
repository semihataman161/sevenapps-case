import type { ImagePickerResult } from 'expo-image-picker';

import { MediaPicker } from '@/services/MediaPicker';

function pickerReturning(result: ImagePickerResult) {
  const launch = jest.fn(async () => result);
  return { picker: new MediaPicker(launch), launch };
}

describe('MediaPicker', () => {
  it('asks the library for a single video and maps the asset', async () => {
    const { picker, launch } = pickerReturning({
      canceled: false,
      assets: [
        { uri: 'file:///a.mov', duration: 12500, width: 1920, height: 1080, fileName: 'a.mov' },
      ],
    } as ImagePickerResult);

    await expect(picker.pickVideo()).resolves.toEqual({
      uri: 'file:///a.mov',
      duration: 12.5,
      width: 1920,
      height: 1080,
      fileName: 'a.mov',
    });
    expect(launch).toHaveBeenCalledWith({
      mediaTypes: ['videos'],
      allowsEditing: false,
      quality: 1,
    });
  });

  it('returns null when the user cancels', async () => {
    const { picker } = pickerReturning({ canceled: true, assets: null });
    await expect(picker.pickVideo()).resolves.toBeNull();
  });

  it('fills unknown metadata with null', async () => {
    const { picker } = pickerReturning({
      canceled: false,
      assets: [{ uri: 'file:///b.mov', width: 0, height: 0 }],
    } as unknown as ImagePickerResult);

    await expect(picker.pickVideo()).resolves.toEqual({
      uri: 'file:///b.mov',
      duration: 0,
      width: null,
      height: null,
      fileName: null,
    });
  });
});
