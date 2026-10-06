import { Image } from 'expo-image';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge, Card, Icon, PressableScale, Row, Typography } from '@/components/commons';
import { formatDate, formatTime } from '@/lib';
import { thumbnailUri } from '@/services';

import type { VideoCardProps } from './types';

export type * from './types';

export function VideoCard({ video, onPress, className = '', ...props }: VideoCardProps) {
  const { t, i18n } = useTranslation();
  const poster = thumbnailUri(video.thumbnailName);

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={t('list.openClip', { name: video.name })}
      onPress={() => onPress(video.id)}
      className={`mx-4 mb-3 ${className}`}
      {...props}
    >
      <Card>
        <Row gap={16} className="p-3">
          <View className="h-20 w-20 overflow-hidden rounded-2xl bg-black/10 dark:bg-white/10">
            {poster ? (
              <Image
                source={{ uri: poster }}
                recyclingKey={video.id}
                contentFit="cover"
                transition={150}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Icon name="film-outline" size={28} tone="muted" />
              </View>
            )}
            <Badge
              tone="overlay"
              label={formatTime(video.duration)}
              className="absolute bottom-1 right-1"
            />
          </View>

          <View className="flex-1">
            <Typography numberOfLines={1} weight="semibold">
              {video.name}
            </Typography>
            {video.description ? (
              <Typography
                variant="label"
                tone="muted"
                numberOfLines={2}
                className="mt-0.5 leading-5"
              >
                {video.description}
              </Typography>
            ) : null}
            <Typography variant="caption" tone="muted" className="mt-1.5">
              {formatDate(video.createdAt, i18n.language)}
            </Typography>
          </View>

          <Icon name="chevron-forward" size={18} tone="muted" />
        </Row>
      </Card>
    </PressableScale>
  );
}
