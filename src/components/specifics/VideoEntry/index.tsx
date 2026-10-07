import { useTranslation } from 'react-i18next';

import { MediaItem } from '@/components/commons';
import { formatDate, wholeSeconds } from '@/lib';
import { videoService } from '@/services';

import { DESCRIPTION_MAX_CHARS, TITLE_MAX_CHARS } from './constants';
import type { VideoEntryProps } from './types';

export type * from './types';

export function VideoEntry({ video, onPress, className = '', ...props }: VideoEntryProps) {
  const { t, i18n } = useTranslation();
  const length = t('common.seconds', { count: wholeSeconds(video.duration) });

  return (
    <MediaItem
      title={video.name}
      description={video.description || undefined}
      meta={`${formatDate(video.createdAt, i18n.language)} · ${length}`}
      imageUri={videoService.thumbnailUri(video.thumbnailName)}
      imageKey={video.id}
      titleMaxChars={TITLE_MAX_CHARS}
      descriptionMaxChars={DESCRIPTION_MAX_CHARS}
      accessibilityLabel={t('list.openClip', { name: video.name })}
      onPress={() => onPress(video.id)}
      className={`px-5 ${className}`}
      {...props}
    />
  );
}
