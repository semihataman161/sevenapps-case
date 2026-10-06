import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Badge, Row, Typography } from '@/components/commons';
import { useFilmstrip } from '@/hooks';
import { useUpperCase } from '@/i18n';
import {
  CLIP_DURATION,
  clipLengthFor,
  formatSeconds,
  formatTime,
  SCRUBBER_TRACK_HEIGHT,
} from '@/lib';

import { Filmstrip } from './Filmstrip';
import { Grip } from './Grip';
import { Playhead } from './Playhead';
import { Shade } from './Shade';
import { TimeLabel } from './TimeLabel';
import type { TrimScrubberProps } from './types';

export type * from './types';

const FRAME_COUNT = 8;
const SCRUB_EVERY_N_EVENTS = 4;

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
          style={{ height: SCRUBBER_TRACK_HEIGHT }}
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
            style={[{ width: windowWidth, height: SCRUBBER_TRACK_HEIGHT }, windowStyle]}
            className="absolute left-0 top-0 flex-row justify-between rounded-2xl border-[3px] border-accent"
          >
            <Grip />
            <Grip />
          </Animated.View>
          <Playhead style={playheadStyle} />
        </View>
      </GestureDetector>

      <Row justify="between" className="mt-3">
        <TimeLabel label={upper(t('crop.start'))} value={formatTime(previewStart, true)} />
        <Badge label={t('crop.selected', { duration: formatSeconds(previewEnd - previewStart) })} />
        <TimeLabel label={upper(t('crop.end'))} value={formatTime(previewEnd, true)} alignRight />
      </Row>
      <Typography variant="caption" tone="muted" className="mt-3 text-center">
        {maxX > 0
          ? t('crop.dragHint', { seconds: clipLength })
          : t('crop.shortHint', { seconds: CLIP_DURATION })}
      </Typography>
    </View>
  );
}
