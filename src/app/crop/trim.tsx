import { Ionicons } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { Redirect, router, useIsFocused } from 'expo-router';
import { useVideoPlayer } from 'expo-video';
import { useCallback, useEffect, useEffectEvent, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StepIndicator } from '@/components/StepIndicator';
import { TrimScrubber } from '@/components/TrimScrubber';
import { VideoFrame } from '@/components/VideoPlayer';
import { Button } from '@/components/ui/Button';
import { configurePlayer, pauseSafely, seekTo } from '@/lib/player';
import { segmentBounds } from '@/lib/time';
import { useCropDraftStore } from '@/store/cropDraftStore';
import type { SourceVideo } from '@/types/video';

export default function TrimScreen() {
  const source = useCropDraftStore((s) => s.source);
  if (!source) return <Redirect href="/crop" />;
  return <TrimEditor source={source} />;
}

function TrimEditor({ source }: { source: SourceVideo }) {
  const insets = useSafeAreaInsets();
  const start = useCropDraftStore((s) => s.start);
  const setStart = useCropDraftStore((s) => s.setStart);
  const setDuration = useCropDraftStore((s) => s.setDuration);

  const player = useVideoPlayer(source.uri, (p) =>
    configurePlayer(p, { loop: false, timeUpdateEventInterval: 0.1 }),
  );
  const { status } = useEvent(player, 'statusChange', { status: player.status });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const bounds = segmentBounds(start, source.duration);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const markLoaded = () => {
      if (player.duration > 0) setDuration(player.duration);
      setLoaded(true);
    };
    const subscriptions = [
      player.addListener('sourceLoad', markLoaded),
      player.addListener('statusChange', ({ status: next }) => {
        if (next === 'readyToPlay') markLoaded();
      }),
    ];
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, [player, setDuration]);
  const ready = loaded && source.duration > 0;

  const onTimeUpdate = useEffectEvent((currentTime: number) => {
    if (currentTime >= bounds.end || currentTime < bounds.start - 0.25)
      seekTo(player, bounds.start);
  });
  const onPlayToEnd = useEffectEvent(() => {
    seekTo(player, bounds.start);
    player.play();
  });
  useEffect(() => {
    const subscriptions = [
      player.addListener('timeUpdate', ({ currentTime }) => onTimeUpdate(currentTime)),
      player.addListener('playToEnd', () => onPlayToEnd()),
    ];
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, [player]);

  const startPreview = useEffectEvent(() => {
    seekTo(player, bounds.start);
    player.play();
  });
  const isFocused = useIsFocused();
  useEffect(() => {
    if (!ready || !isFocused) return;
    startPreview();
    return () => pauseSafely(player);
  }, [player, ready, isFocused]);

  const handleScrub = useCallback(
    (seconds: number) => {
      player.pause();
      seekTo(player, seconds);
    },
    [player],
  );

  const handleChange = useCallback(
    (seconds: number) => {
      setStart(seconds);
      seekTo(player, seconds);
      player.play();
    },
    [player, setStart],
  );

  const togglePlayback = () => (player.playing ? player.pause() : player.play());

  return (
    <View className="flex-1" style={{ paddingBottom: insets.bottom + 16 }}>
      <StepIndicator step={1} />
      <ScrollView contentContainerClassName="px-5 pt-2 pb-6" bounces={false}>
        <Pressable onPress={togglePlayback} accessibilityLabel={isPlaying ? 'Pause' : 'Play'}>
          <VideoFrame
            player={player}
            nativeControls={false}
            aspectRatio={source.width && source.height ? source.width / source.height : undefined}
          />
          {!isPlaying && ready ? (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              pointerEvents="none"
              className="absolute inset-0 items-center justify-center"
            >
              <View className="h-16 w-16 items-center justify-center rounded-full bg-black/50">
                <Ionicons name="play" size={30} color="#fff" style={{ marginLeft: 4 }} />
              </View>
            </Animated.View>
          ) : null}
        </Pressable>

        {status === 'error' ? (
          <Text className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
            This video can&apos;t be played. Go back and pick another one.
          </Text>
        ) : null}

        <View className="mt-6">
          <TrimScrubber
            player={player}
            duration={source.duration}
            start={start}
            ready={ready}
            onScrub={handleScrub}
            onChange={handleChange}
          />
        </View>
      </ScrollView>

      <View className="px-5">
        <Button
          title="Next"
          icon="arrow-forward"
          disabled={!ready}
          onPress={() => router.push('/crop/details')}
        />
      </View>
    </View>
  );
}
