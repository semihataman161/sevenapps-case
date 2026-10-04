import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { VideoPlayer } from '@/components/VideoPlayer';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDeleteVideoMutation } from '@/hooks/useVideoMutations';
import { formatDate, formatSeconds } from '@/lib/time';
import { useThemeColors } from '@/lib/theme';
import { videoUri } from '@/services/videoFiles';
import { useVideo } from '@/store/videoStore';

export default function VideoDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const video = useVideo(id);
  const colors = useThemeColors();
  const deleteMutation = useDeleteVideoMutation();

  if (!video) {
    return (
      <EmptyState
        icon="help-circle-outline"
        title="Clip not found"
        message="It may have been deleted."
        action={<Button title="Back to diary" variant="secondary" onPress={() => router.back()} />}
      />
    );
  }

  const openEditor = () => router.push({ pathname: '/video/[id]/edit', params: { id: video.id } });

  const confirmDelete = () =>
    Alert.alert('Delete clip?', `"${video.name}" will be removed from your diary.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          deleteMutation.mutate(video, {
            onSuccess: () => router.back(),
            onError: (error) => Alert.alert('Could not delete clip', error.message),
          }),
      },
    ]);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={openEditor} hitSlop={12} accessibilityLabel="Edit details">
              <Ionicons name="create-outline" size={24} color={colors.accent} />
            </Pressable>
          ),
        }}
      />
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
            <Meta icon="calendar-outline" text={formatDate(video.createdAt)} />
            <Meta icon="time-outline" text={`${formatSeconds(video.duration)} clip`} />
          </View>

          {video.description ? (
            <Text className="mt-5 text-base leading-7 text-ink dark:text-neutral-200">
              {video.description}
            </Text>
          ) : (
            <Pressable onPress={openEditor}>
              <Text className="mt-5 text-base italic text-ink-muted">
                No description yet — tap to add one.
              </Text>
            </Pressable>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(350)} className="mt-10 gap-3">
          <Button
            title="Edit details"
            icon="create-outline"
            variant="secondary"
            onPress={openEditor}
          />
          <Button
            title="Delete clip"
            icon="trash-outline"
            variant="danger"
            loading={deleteMutation.isPending}
            onPress={confirmDelete}
          />
        </Animated.View>
      </ScrollView>
    </>
  );
}

function Meta({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const colors = useThemeColors();
  return (
    <View className="flex-row items-center gap-1">
      <Ionicons name={icon} size={14} color={colors.muted} />
      <Text className="text-sm text-ink-muted">{text}</Text>
    </View>
  );
}
