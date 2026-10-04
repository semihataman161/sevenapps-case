import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { formatDate, formatTime } from '@/lib/time';
import { useThemeColors } from '@/lib/theme';
import { thumbnailUri } from '@/services/videoFiles';
import type { DiaryVideo } from '@/types/video';

type VideoCardProps = {
  video: DiaryVideo;
  onPress: (id: string) => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function VideoCardComponent({ video, onPress }: VideoCardProps) {
  const colors = useThemeColors();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const poster = thumbnailUri(video.thumbnailName);

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${video.name}`}
      onPress={() => onPress(video.id)}
      onPressIn={() => scale.set(withSpring(0.98, { duration: 150 }))}
      onPressOut={() => scale.set(withSpring(1, { duration: 200 }))}
      style={animatedStyle}
      className="mx-4 mb-3 flex-row items-center gap-4 rounded-3xl bg-surface-muted p-3 dark:bg-surface-dark-muted"
    >
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
            <Ionicons name="film-outline" size={28} color={colors.muted} />
          </View>
        )}
        <View className="absolute bottom-1 right-1 rounded-md bg-black/60 px-1.5 py-0.5">
          <Text className="text-[10px] font-semibold text-white">{formatTime(video.duration)}</Text>
        </View>
      </View>

      <View className="flex-1">
        <Text numberOfLines={1} className="text-base font-semibold text-ink dark:text-white">
          {video.name}
        </Text>
        {video.description ? (
          <Text numberOfLines={2} className="mt-0.5 text-sm leading-5 text-ink-muted">
            {video.description}
          </Text>
        ) : null}
        <Text className="mt-1.5 text-xs text-ink-muted">{formatDate(video.createdAt)}</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </AnimatedPressable>
  );
}

export const VideoCard = memo(VideoCardComponent);
