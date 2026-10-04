import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VideoCard } from '@/components/VideoCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useVideo, useVideoStore } from '@/store/videoStore';

function openVideo(id: string) {
  router.push({ pathname: '/video/[id]', params: { id } });
}

function openCropModal() {
  router.push('/crop');
}

function VideoRow({ id }: { id: string }) {
  const video = useVideo(id);
  return video ? <VideoCard video={video} onPress={openVideo} /> : null;
}

export default function VideoListScreen() {
  const ids = useVideoStore((s) => s.ids);
  const status = useVideoStore((s) => s.status);
  const error = useVideoStore((s) => s.error);
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
              title="Couldn't load your diary"
              message={error ?? 'Something went wrong while reading your saved clips.'}
              action={<Button title="Try again" variant="secondary" onPress={hydrate} />}
            />
          ) : (
            <EmptyState
              icon="videocam-outline"
              title="No clips yet"
              message="Import a video, pick your favourite 5 seconds and keep it here with a note."
              action={<Button title="Crop your first clip" icon="add" onPress={openCropModal} />}
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
            title="New clip"
            icon="add"
            onPress={openCropModal}
            className="shadow-lg shadow-accent/30"
          />
        </Animated.View>
      ) : null}
    </View>
  );
}
