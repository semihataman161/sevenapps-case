import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FlashList, type ListRenderItem } from '@shopify/flash-list';

import { Button, Spinner } from '@/components/commons';
import {
  ArchiveHeader,
  CropModal,
  EmptyState,
  VideoRow,
  type CropModalRef,
} from '@/components/specifics';
import { CLIP_DURATION } from '@/lib';
import { useVideoStore } from '@/stores';

function openVideo(id: string) {
  router.push({ pathname: '/videos/[id]', params: { id } });
}

function openSettings() {
  router.push('/settings');
}

export default function VideoListScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const ids = useVideoStore((s) => s.ids);
  const status = useVideoStore((s) => s.status);
  const total = useVideoStore((s) => s.total);
  const isLoadingMore = useVideoStore((s) => s.isLoadingMore);
  const hydrate = useVideoStore((s) => s.hydrate);
  const loadMore = useVideoStore((s) => s.loadMore);
  const cropModalRef = useRef<CropModalRef>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const openCropModal = () => cropModalRef.current?.show();

  const renderItem = useCallback<ListRenderItem<string>>(
    ({ item }) => <VideoRow id={item} onPress={openVideo} />,
    [],
  );

  if (status === 'idle' || status === 'loading') {
    return (
      <View className="flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  const header = (
    <ArchiveHeader count={total} onNewClip={openCropModal} onOpenSettings={openSettings} />
  );

  return (
    <View className="flex-1">
      {ids.length > 0 ? (
        <FlashList
          data={ids}
          keyExtractor={(id) => id}
          renderItem={renderItem}
          ListHeaderComponent={header}
          ListFooterComponent={isLoadingMore ? <Spinner className="py-6" /> : null}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}
        />
      ) : (
        <View className="flex-1">
          <View onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>
            {header}
          </View>
          <View className="flex-1 justify-center" style={{ paddingBottom: headerHeight }}>
            {status === 'error' ? (
              <EmptyState
                className="px-5"
                align="center"
                eyebrow={t('list.errorTitle')}
                title={t('list.errorMessage')}
                action={
                  <Button
                    variant="text"
                    icon="refresh"
                    title={t('common.tryAgain')}
                    onPress={hydrate}
                  />
                }
              />
            ) : (
              <EmptyState
                className="px-5"
                align="center"
                eyebrow={t('list.emptyTitle')}
                title={t('list.emptyMessage', { seconds: CLIP_DURATION })}
                message={t('list.emptyHint', { action: t('list.newClip') })}
              />
            )}
          </View>
        </View>
      )}

      <CropModal ref={cropModalRef} />
    </View>
  );
}
