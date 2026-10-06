import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useCallback, useRef } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FlashList, type ListRenderItem } from '@shopify/flash-list';

import { Button } from '@/components/commons';
import { CropModal, EmptyState, VideoRow, type CropModalRef } from '@/components/specifics';
import { CLIP_DURATION, useThemeColors } from '@/lib';
import { useVideoStore } from '@/store';

function openVideo(id: string) {
  router.push({ pathname: '/video/[id]', params: { id } });
}

function openSettings() {
  router.push('/settings');
}

export default function VideoListScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const ids = useVideoStore((s) => s.ids);
  const status = useVideoStore((s) => s.status);
  const hydrate = useVideoStore((s) => s.hydrate);
  const insets = useSafeAreaInsets();
  const cropModalRef = useRef<CropModalRef>(null);

  const openCropModal = () => cropModalRef.current?.show();

  const renderItem = useCallback<ListRenderItem<string>>(
    ({ item }) => <VideoRow id={item} onPress={openVideo} />,
    [],
  );

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

      <CropModal ref={cropModalRef} onSaved={openVideo} />
    </View>
  );
}
