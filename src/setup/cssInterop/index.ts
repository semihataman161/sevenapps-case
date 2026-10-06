import { VideoView } from 'expo-video';
import { cssInterop } from 'nativewind';

export function registerCssInterop(): void {
  cssInterop(VideoView, { className: 'style' });
}
