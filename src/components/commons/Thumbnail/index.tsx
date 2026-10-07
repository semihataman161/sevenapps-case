import { Image } from 'expo-image';

import type { ThumbnailProps } from './types';

export type * from './types';

export function Thumbnail({
  contentFit = 'cover',
  transition = 150,
  style,
  ...props
}: ThumbnailProps) {
  return (
    <Image
      contentFit={contentFit}
      transition={transition}
      style={[{ width: '100%', height: '100%' }, style]}
      {...props}
    />
  );
}
