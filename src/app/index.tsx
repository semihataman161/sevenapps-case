import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VideoCard } from '@/components/VideoCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { CLIP_DURATION } from '@/lib/constants';
import { useThemeColors } from '@/lib/theme';
import { useVideo, useVideoStore } from '@/store/videoStore';

function openVideo(id: string) {
  router.push({ pathname: '/video/[id]', params: { id } });
}

function openCropModal() {
  router.push('/crop');
}

function openSettings() {
  router.push('/settings');
}

function VideoRow({ id }: { id: string }) {
  const video = useVideo(id);
  return video ? <VideoCard video={video} onPress={openVideo} /> : null;
}

export default function VideoListScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const ids = useVideoStore((s) => s.ids);
  const status = useVideoStore((s) => s.status);
  const hydrate = useVideoStore((s) => s.hydrate);
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(({ item }: { item: string }) => <VideoRow id={item} />, []);

  if (status === 'idle' || status === 'loading') {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={openSettings}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={t('nav.settings')}
            >
              <Ionicons name="settings-outline" size={24} color={colors.accent} />
            </Pressable>
          ),
        }}
      />
      <FlashList
        data={ids}
        keyExtractor={(id) => id}
        renderItem={renderItem}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingTop: 8, paddingBottom: insets.bottom + 96 }}
        ListEmptyComponent={
          status === 'error' ? (
            <EmptyState
              icon="alert-circle-outline"
              title={t('list.errorTitle')}
              message={t('list.errorMessage')}
              action={<Button title={t('common.tryAgain')} variant="secondary" onPress={hydrate} />}
            />
          ) : (
            <EmptyState
              icon="videocam-outline"
              title={t('list.emptyTitle')}
              message={t('list.emptyMessage', { seconds: CLIP_DURATION })}
              action={<Button title={t('list.emptyAction')} icon="add" onPress={openCropModal} />}
            />
          )
        }
      />

      {ids.length > 0 ? (
        <Animated.View
          entering={FadeInUp.springify()}
          className="absolute inset-x-0 px-5"
          style={{ bottom: insets.bottom + 12 }}
        >
          <Button
            title={t('list.newClip')}
            icon="add"
            onPress={openCropModal}
            className="shadow-lg shadow-accent/30"
          />
        </Animated.View>
      ) : null}
    </View>
  );
}
