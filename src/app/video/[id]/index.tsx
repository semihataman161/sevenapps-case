import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button } from '@/components/commons';
import { EmptyState, MetaItem, VideoPlayer } from '@/components/specifics';
import { useDeleteVideoMutation } from '@/hooks';
import { formatDate, formatSeconds } from '@/lib';
import { videoUri } from '@/services';
import { useVideo } from '@/store';
import type { IdRouteParams } from '@/types';

export default function VideoDetailsScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<IdRouteParams>();
  const video = useVideo(id);
  const deleteMutation = useDeleteVideoMutation();

  if (!video) {
    return (
      <EmptyState
        icon="help-circle-outline"
        title={t('video.notFoundTitle')}
        message={t('video.notFoundMessage')}
        action={
          <Button
            title={t('video.backToDiary')}
            variant="secondary"
            onPress={() => router.back()}
          />
        }
      />
    );
  }

  const openEditor = () => router.push({ pathname: '/video/[id]/edit', params: { id: video.id } });

  const confirmDelete = () =>
    Alert.alert(t('video.deleteTitle'), t('video.deleteMessage', { name: video.name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () =>
          deleteMutation.mutate(video, {
            onSuccess: () => router.back(),
            onError: (error) => Alert.alert(t('video.deleteFailed'), error.message),
          }),
      },
    ]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="px-5 pb-12 pt-2"
    >
      <VideoPlayer
        uri={videoUri(video.fileName)}
        aspectRatio={video.width && video.height ? video.width / video.height : undefined}
        autoPlay
        loop
      />

      <Animated.View entering={FadeInDown.delay(100).duration(350)} className="mt-6">
        <Text className="text-2xl font-bold text-ink dark:text-white">{video.name}</Text>
        <View className="mt-2 flex-row items-center gap-3">
          <MetaItem icon="calendar-outline" text={formatDate(video.createdAt, i18n.language)} />
          <MetaItem
            icon="time-outline"
            text={t('video.clipLength', { duration: formatSeconds(video.duration) })}
          />
        </View>

        {video.description ? (
          <Text className="mt-5 text-base leading-7 text-ink dark:text-neutral-200">
            {video.description}
          </Text>
        ) : (
          <Pressable onPress={openEditor}>
            <Text className="mt-5 text-base italic text-ink-muted">{t('video.noDescription')}</Text>
          </Pressable>
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(350)} className="mt-10 gap-3">
        <Button
          title={t('video.edit')}
          icon="create-outline"
          variant="secondary"
          onPress={openEditor}
        />
        <Button
          title={t('video.delete')}
          icon="trash-outline"
          variant="danger"
          loading={deleteMutation.isPending}
          onPress={confirmDelete}
        />
      </Animated.View>
    </ScrollView>
  );
}
