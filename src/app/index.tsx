import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FlashList, type FlashListRef, type ListRenderItem } from '@shopify/flash-list';

import { Button, Spinner } from '@/components/commons';
import {
  CropJobRow,
  CropModal,
  EmptyState,
  VideoListHeader,
  VideoRow,
  type CropModalRef,
} from '@/components/specifics';
import { useCropJobs } from '@/hooks';
import { CLIP_DURATION } from '@/lib';
import { useVideoStore } from '@/services';
import { usePick } from '@/stores';

function openVideo(id: string) {
  router.push({ pathname: '/videos/[id]', params: { id } });
}

function openSettings() {
  router.push('/settings');
}

export default function VideoListScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { ids, status, total, query, isLoadingMore, hydrate, loadMore, search } = usePick(
    useVideoStore,
    ['ids', 'status', 'total', 'query', 'isLoadingMore', 'hydrate', 'loadMore', 'search'],
  );
  const { jobs, retry, dismiss } = useCropJobs();
  const cropModalRef = useRef<CropModalRef>(null);
  const listRef = useRef<FlashListRef<string>>(null);
  const lastJobIdRef = useRef(0);
  const latestJobId = jobs[0]?.id ?? 0;
  const [headerHeight, setHeaderHeight] = useState(0);

  const openCropModal = () => cropModalRef.current?.show();

  useEffect(() => {
    if (latestJobId <= lastJobIdRef.current) return;
    lastJobIdRef.current = latestJobId;
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [latestJobId]);

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

  const renderEmpty = () => {
    if (status === 'error') {
      return (
        <EmptyState
          className="px-5"
          align="center"
          eyebrow={t('list.errorTitle')}
          title={t('list.errorMessage')}
          action={
            <Button variant="text" icon="refresh" title={t('common.tryAgain')} onPress={hydrate} />
          }
        />
      );
    }
    if (query) {
      return (
        <EmptyState
          className="px-5"
          align="center"
          eyebrow={t('list.noResultsTitle')}
          title={t('list.noResultsMessage', { query })}
        />
      );
    }
    return (
      <EmptyState
        className="px-5"
        align="center"
        eyebrow={t('list.emptyTitle')}
        title={t('list.emptyMessage', { seconds: CLIP_DURATION })}
        message={t('list.emptyHint', { action: t('list.newClip') })}
      />
    );
  };

  return (
    <View className="flex-1">
      <View onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>
        <VideoListHeader
          count={total}
          onNewClip={openCropModal}
          onOpenSettings={openSettings}
          initialQuery={query}
          onSearch={total > 0 ? search : undefined}
        />
      </View>

      {ids.length > 0 || jobs.length > 0 ? (
        <FlashList
          ref={listRef}
          data={ids}
          maintainVisibleContentPosition={{ disabled: true }}
          keyExtractor={(id) => id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListHeaderComponent={
            jobs.length > 0 ? (
              <View>
                {jobs.map((job) => (
                  <CropJobRow key={job.id} job={job} onRetry={retry} onDismiss={dismiss} />
                ))}
              </View>
            ) : null
          }
          ListFooterComponent={isLoadingMore ? <Spinner className="py-6" /> : null}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}
        />
      ) : (
        <View className="flex-1 justify-center" style={{ paddingBottom: headerHeight }}>
          {renderEmpty()}
        </View>
      )}

      <CropModal ref={cropModalRef} />
    </View>
  );
}
