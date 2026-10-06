import { useEvent } from 'expo';
import { router, useIsFocused } from 'expo-router';
import { useVideoPlayer } from 'expo-video';
import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { configurePlayer, pauseSafely, seekTo, segmentBounds } from '@/lib';
import { useCropDraftStore } from '@/store';

import { Button, Icon, Typography, VideoFrame } from '@/components/commons';
import { StepIndicator } from '../StepIndicator';
import { TrimScrubber } from '../TrimScrubber';
import type { TrimEditorProps } from './types';

export type * from './types';

const TIME_UPDATE_INTERVAL = 0.1;
const LOOP_LEAD = Platform.OS === 'android' ? 0.07 : 1 / 60;
const MAX_LOOKAHEAD = 0.15;
const SEEK_SETTLE_MS = 150;

export function TrimEditor({ source }: TrimEditorProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const start = useCropDraftStore((s) => s.start);
  const setStart = useCropDraftStore((s) => s.setStart);
  const setDuration = useCropDraftStore((s) => s.setDuration);

  const player = useVideoPlayer(source.uri, (p) =>
    configurePlayer(p, { loop: false, timeUpdateEventInterval: TIME_UPDATE_INTERVAL }),
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

  const lastCheck = useRef({ at: 0, loopedAt: 0 });
  const keepInSegment = useEffectEvent(() => {
    const now = performance.now();
    const check = lastCheck.current;
    const sinceLastCheck = check.at ? (now - check.at) / 1000 : 1 / 60;
    check.at = now;
    if (now - check.loopedAt < SEEK_SETTLE_MS) return;

    const position = player.currentTime;
    const nextPosition = position + Math.min(sinceLastCheck, MAX_LOOKAHEAD) * player.playbackRate;
    if (nextPosition >= bounds.end - LOOP_LEAD || position < bounds.start - 0.25) {
      check.loopedAt = now;
      seekTo(player, bounds.start);
    }
  });
  const onPlayToEnd = useEffectEvent(() => {
    seekTo(player, bounds.start);
    player.play();
  });
  useEffect(() => {
    const subscription = player.addListener('playToEnd', () => onPlayToEnd());
    return () => subscription.remove();
  }, [player]);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isPlaying || !isFocused) return;
    lastCheck.current.at = 0;
    let frame = requestAnimationFrame(function tick() {
      keepInSegment();
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, isFocused]);

  const startPreview = useEffectEvent(() => {
    seekTo(player, bounds.start);
    player.play();
  });
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
        <Pressable
          onPress={togglePlayback}
          accessibilityLabel={isPlaying ? t('crop.pause') : t('crop.play')}
        >
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
                <Icon name="play" size={30} tone="inverse" style={{ marginLeft: 4 }} />
              </View>
            </Animated.View>
          ) : null}
        </Pressable>

        {status === 'error' ? (
          <Typography variant="label" tone="danger" className="mt-4 text-center">
            {t('crop.playbackError')}
          </Typography>
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
          title={t('common.next')}
          icon="arrow-forward"
          disabled={!ready}
          onPress={() => router.push('/crop/details')}
        />
      </View>
    </View>
  );
}
