import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import type { VideoPlayer } from 'expo-video';
import { useEffect, useMemo, useState } from 'react';
import { Text, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useFilmstrip } from '@/hooks/useFilmstrip';
import { useUpperCase } from '@/i18n/useUpperCase';
import { CLIP_DURATION } from '@/lib/constants';
import { clipLengthFor, formatSeconds, formatTime } from '@/lib/time';

const TRACK_HEIGHT = 64;
const FRAME_COUNT = 8;
const SCRUB_EVERY_N_EVENTS = 4;

type TrimScrubberProps = {
  player: VideoPlayer;
  duration: number;
  start: number;
  ready: boolean;
  onScrub: (start: number) => void;
  onChange: (start: number) => void;
};

export function TrimScrubber({
  player,
  duration,
  start,
  ready,
  onScrub,
  onChange,
}: TrimScrubberProps) {
  const { t } = useTranslation();
  const upper = useUpperCase();
  const [trackWidth, setTrackWidth] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const frames = useFilmstrip(player, duration, FRAME_COUNT, ready);

  const clipLength = clipLengthFor(duration);
  const windowWidth = duration > 0 ? (trackWidth * clipLength) / duration : trackWidth;
  const maxX = Math.max(0, trackWidth - windowWidth);

  const x = useSharedValue(0);
  const dragOrigin = useSharedValue(0);
  const dragging = useSharedValue(false);
  const panEvents = useSharedValue(0);
  const playhead = useSharedValue(0);

  useEffect(() => {
    if (dragging.get() || trackWidth === 0 || duration <= 0) return;
    x.set((start / duration) * trackWidth);
  }, [start, duration, trackWidth, x, dragging]);

  useEffect(() => {
    if (trackWidth === 0 || duration <= 0) return;
    const subscription = player.addListener('timeUpdate', ({ currentTime }) => {
      playhead.set(withTiming((currentTime / duration) * trackWidth, { duration: 100 }));
    });
    return () => subscription.remove();
  }, [player, duration, trackWidth, playhead]);

  const gesture = useMemo(() => {
    const toSeconds = (position: number) => {
      'worklet';
      return trackWidth > 0 ? (position / trackWidth) * duration : 0;
    };
    const clamp = (value: number) => {
      'worklet';
      return Math.min(Math.max(value, 0), maxX);
    };

    const scrub = (seconds: number) => {
      setDragStart(seconds);
      onScrub(seconds);
    };
    const commit = (seconds: number) => {
      setDragStart(null);
      onChange(seconds);
    };
    const tick = () => {
      Haptics.selectionAsync().catch(() => {});
    };

    const pan = Gesture.Pan()
      .enabled(maxX > 0)
      .onStart(() => {
        dragOrigin.set(x.get());
        dragging.set(true);
        panEvents.set(0);
        scheduleOnRN(tick);
      })
      .onUpdate((event) => {
        x.set(clamp(dragOrigin.get() + event.translationX));
        panEvents.set(panEvents.get() + 1);
        if (panEvents.get() % SCRUB_EVERY_N_EVENTS === 1) scheduleOnRN(scrub, toSeconds(x.get()));
      })
      .onEnd(() => {
        scheduleOnRN(commit, toSeconds(x.get()));
      })
      .onFinalize(() => {
        dragging.set(false);
      });

    const tap = Gesture.Tap()
      .enabled(maxX > 0)
      .onEnd((event) => {
        const target = clamp(event.x - windowWidth / 2);
        x.set(withTiming(target, { duration: 180 }));
        scheduleOnRN(commit, toSeconds(target));
        scheduleOnRN(tick);
      });

    return Gesture.Race(pan, tap);
  }, [
    trackWidth,
    duration,
    maxX,
    windowWidth,
    x,
    dragOrigin,
    dragging,
    panEvents,
    onScrub,
    onChange,
  ]);

  const windowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));
  const leftShadeStyle = useAnimatedStyle(() => ({ width: x.get() }));
  const rightShadeStyle = useAnimatedStyle(() => ({ left: x.get() + windowWidth }));
  const playheadStyle = useAnimatedStyle(() => ({
    opacity: dragging.get() ? 0 : 1,
    transform: [{ translateX: playhead.get() }],
  }));

  const onLayout = (event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width);
  const previewStart = dragStart ?? start;
  const previewEnd = Math.min(previewStart + clipLength, duration);

  return (
    <View>
      <GestureDetector gesture={gesture}>
        <View
          onLayout={onLayout}
          className="overflow-hidden rounded-2xl bg-surface-muted dark:bg-surface-dark-muted"
          style={{ height: TRACK_HEIGHT }}
          accessibilityRole="adjustable"
          accessibilityLabel={t('crop.segmentSelector')}
          accessibilityValue={{
            text: t('crop.segmentRange', {
              start: formatTime(previewStart),
              end: formatTime(previewEnd),
            }),
          }}
        >
          <Filmstrip frames={frames} />
          <Shade style={leftShadeStyle} className="left-0" />
          <Shade style={rightShadeStyle} className="right-0" />
          <Animated.View
            pointerEvents="none"
            style={[{ width: windowWidth, height: TRACK_HEIGHT }, windowStyle]}
            className="absolute left-0 top-0 flex-row justify-between rounded-2xl border-[3px] border-accent"
          >
            <Grip />
            <Grip />
          </Animated.View>
          <Playhead style={playheadStyle} />
        </View>
      </GestureDetector>

      <View className="mt-3 flex-row items-center justify-between">
        <TimeLabel label={upper(t('crop.start'))} value={formatTime(previewStart, true)} />
        <View className="rounded-full bg-accent-soft px-3 py-1 dark:bg-surface-dark-muted">
          <Text className="text-xs font-semibold text-accent">
            {t('crop.selected', { duration: formatSeconds(previewEnd - previewStart) })}
          </Text>
        </View>
        <TimeLabel label={upper(t('crop.end'))} value={formatTime(previewEnd, true)} alignRight />
      </View>
      {maxX > 0 ? (
        <Text className="mt-3 text-center text-xs text-ink-muted">
          {t('crop.dragHint', { seconds: clipLength })}
        </Text>
      ) : (
        <Text className="mt-3 text-center text-xs text-ink-muted">
          {t('crop.shortHint', { seconds: CLIP_DURATION })}
        </Text>
      )}
    </View>
  );
}

function Filmstrip({ frames }: { frames: ReturnType<typeof useFilmstrip> }) {
  return (
    <View className="absolute inset-0 flex-row">
      {frames.map((frame, index) => (
        <Image
          key={index}
          source={frame}
          contentFit="cover"
          transition={120}
          style={{ flex: 1, height: TRACK_HEIGHT }}
        />
      ))}
    </View>
  );
}

type AnimatedStyle = ReturnType<typeof useAnimatedStyle<ViewStyle>>;

function Shade({ style, className }: { style: AnimatedStyle; className: string }) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ height: TRACK_HEIGHT }, style]}
      className={`absolute top-0 bg-black/55 ${className}`}
    />
  );
}

function Grip() {
  return (
    <View className="h-full w-3 items-center justify-center bg-accent">
      <View className="h-5 w-0.5 rounded-full bg-white" />
    </View>
  );
}

function Playhead({ style }: { style: AnimatedStyle }) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ height: TRACK_HEIGHT }, style]}
      className="absolute left-0 top-0 w-0.5 bg-white"
    />
  );
}

function TimeLabel({
  label,
  value,
  alignRight = false,
}: {
  label: string;
  value: string;
  alignRight?: boolean;
}) {
  return (
    <View className={alignRight ? 'items-end' : 'items-start'}>
      <Text className="text-[11px] font-semibold tracking-wider text-ink-muted">{label}</Text>
      <Text
        className="text-base font-semibold text-ink dark:text-white"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {value}
      </Text>
    </View>
  );
}
