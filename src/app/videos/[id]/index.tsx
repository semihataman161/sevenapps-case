import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Divider, Row, Spinner, Typography } from '@/components/commons';
import { ActionRow, EmptyState, ScreenHeader, VideoPlayer } from '@/components/specifics';
import { useDeleteVideoMutation, useVideoRecord, videoErrorKey } from '@/hooks';
import { formatDate, formatTime, wholeSeconds } from '@/lib';
import { videoService } from '@/services';

export default function VideoDetailsScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<'/videos/[id]'>();
  const { video, isLoading } = useVideoRecord(id);
  const deleteMutation = useDeleteVideoMutation();

  if (isLoading) {
    return (
      <View className="flex-1">
        <ScreenHeader />
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  if (!video) {
    return (
      <View className="flex-1">
        <ScreenHeader />
        <View className="flex-1 justify-center" style={{ paddingBottom: insets.top + 48 }}>
          <EmptyState
            className="px-5"
            title={t('video.notFoundTitle')}
            message={t('video.notFoundMessage')}
            action={
              <Button
                variant="text"
                icon="arrow-back"
                title={t('video.backToDiary')}
                onPress={() => router.back()}
              />
            }
          />
        </View>
      </View>
    );
  }

  const openEditor = () => router.push({ pathname: '/videos/[id]/edit', params: { id: video.id } });

  const confirmDelete = () =>
    Alert.alert(t('video.deleteTitle'), t('video.deleteMessage', { name: video.name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () =>
          deleteMutation.mutate(video, {
            onSuccess: () => router.back(),
            onError: (error) =>
              Alert.alert(t('video.deleteFailed'), t(videoErrorKey(error, 'delete'))),
          }),
      },
    ]);

  return (
    <View className="flex-1">
      <ScreenHeader />
      <ScrollView
        contentContainerClassName="px-5 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}
      >
        <Typography variant="overline" tone="secondary" tabular className="mb-4">
          {formatDate(video.createdAt, i18n.language)}
        </Typography>

        <VideoPlayer
          uri={videoService.videoUri(video.fileName)}
          aspectRatio={video.width && video.height ? video.width / video.height : undefined}
          autoPlay
          loop
        />

        <Animated.View entering={FadeIn.delay(100).duration(400)}>
          <Typography variant="headline" className="mt-8">
            {video.name}
          </Typography>

          {video.description ? (
            <Typography className="mt-4">{video.description}</Typography>
          ) : (
            <Button
              variant="text"
              title={t('video.noDescription')}
              textVariant="body"
              textTone="muted"
              onPress={openEditor}
              className="mt-4 self-start"
            />
          )}

          <Row gap={16} className="mt-8 flex-wrap">
            <Typography variant="overline" tabular>
              {t('common.seconds', { count: wholeSeconds(video.duration) })}
            </Typography>
            <Typography variant="overline" tone="secondary" tabular>
              {t('video.sourceRange', {
                start: formatTime(video.sourceStart, true),
                end: formatTime(video.sourceStart + video.duration, true),
              })}
            </Typography>
          </Row>

          <View className="mt-10">
            <Divider />
            <ActionRow label={t('video.edit')} icon="arrow-forward" onPress={openEditor} />
            <ActionRow
              label={t('video.delete')}
              icon="close"
              tone="danger"
              loading={deleteMutation.isPending}
              onPress={confirmDelete}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
