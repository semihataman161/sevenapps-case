import { useEvent } from 'expo';
import { useVideoPlayer } from 'expo-video';
import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useFilmstrip } from '@/hooks';
import {
  CLIP_DURATION,
  clipLengthFor,
  formatTime,
  segmentBounds,
  useBottomGap,
  wholeSeconds,
} from '@/lib';
import { videoService } from '@/services';
import { useCropDraftStore, usePick } from '@/stores';

import { Button, Icon, Spinner, Touchable, Typography, VideoFrame } from '@/components/commons';
import { TrimScrubber } from '../../../TrimScrubber';
import {
  FRAME_COUNT,
  LOOP_LEAD,
  MAX_LOOKAHEAD,
  SEEK_SETTLE_MS,
  TIME_UPDATE_INTERVAL,
} from './constants';
import type { TrimStepProps } from './types';

export type * from './types';

export function TrimStep({
  source,
  onNext,
  active = true,
  className = '',
  style,
  ...props
}: TrimStepProps) {
  const { t } = useTranslation();
  const bottomGap = useBottomGap();
  const { start, setStart, setDuration } = usePick(useCropDraftStore, [
    'start',
    'setStart',
    'setDuration',
  ]);

  const player = useVideoPlayer(source.uri, (p) =>
    videoService.configurePlayer(p, { loop: false, timeUpdateEventInterval: TIME_UPDATE_INTERVAL }),
  );
  const { status } = useEvent(player, 'statusChange', { status: player.status });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const bounds = segmentBounds(start, source.duration);
  const windowLength = clipLengthFor(source.duration);

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
  const filmstrip = useFilmstrip(player, source.duration, FRAME_COUNT, ready);
  const isPreparing = status !== 'error' && (!ready || !filmstrip.settled);

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
      videoService.seek(player, bounds.start);
    }
  });
  const onPlayToEnd = useEffectEvent(() => {
    videoService.seek(player, bounds.start);
    player.play();
  });
  useEffect(() => {
    const subscription = player.addListener('playToEnd', () => onPlayToEnd());
    return () => subscription.remove();
  }, [player]);

  useEffect(() => {
    if (!isPlaying || !active) return;
    lastCheck.current.at = 0;
    let frame = requestAnimationFrame(function tick() {
      keepInSegment();
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, active]);

  const startPreview = useEffectEvent(() => {
    videoService.seek(player, bounds.start);
    player.play();
  });
  useEffect(() => {
    if (!ready || isPreparing || !active) return;
    startPreview();
    return () => videoService.pause(player);
  }, [player, ready, isPreparing, active]);

  const handleScrub = useCallback(
    (seconds: number) => {
      player.pause();
      videoService.seek(player, seconds);
    },
    [player],
  );

  const handleChange = useCallback(
    (seconds: number) => {
      setStart(seconds);
      videoService.seek(player, seconds);
      player.play();
    },
    [player, setStart],
  );

  const togglePlayback = () => (player.playing ? player.pause() : player.play());

  if (isPreparing) {
    return (
      <View
        className={`flex-1 items-center justify-center gap-4 ${className}`}
        style={[{ paddingBottom: bottomGap }, style]}
        {...props}
      >
        <Spinner />
        <Typography variant="overline" tone="secondary">
          {t('crop.preparing')}
        </Typography>
      </View>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      className={`flex-1 ${className}`}
      style={[{ paddingBottom: bottomGap }, style]}
      {...props}
    >
      <ScrollView contentContainerClassName="grow justify-center px-5 py-4" bounces={false}>
        <Touchable
          pressedOpacity={1}
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
              <View className="h-12 w-12 items-center justify-center rounded-sm bg-black/55">
                <Icon name="play" size={22} color="#F5F3EE" style={{ marginLeft: 2 }} />
              </View>
            </Animated.View>
          ) : null}
        </Touchable>

        {status === 'error' ? (
          <Typography variant="label" tone="danger" className="mt-4">
            {t('crop.playbackError')}
          </Typography>
        ) : null}

        <View className="mt-8">
          <TrimScrubber
            player={player}
            duration={source.duration}
            windowLength={windowLength}
            start={start}
            frames={filmstrip.frames}
            labels={{
              selector: t('crop.segmentSelector'),
              start: t('crop.start'),
              end: t('crop.end'),
              hint:
                windowLength < source.duration
                  ? t('crop.dragHint', { seconds: windowLength })
                  : t('crop.shortHint', { seconds: CLIP_DURATION }),
            }}
            formatLength={(seconds) => t('common.seconds', { count: wholeSeconds(seconds) })}
            formatRange={(from, to) =>
              t('crop.segmentRange', { start: formatTime(from), end: formatTime(to) })
            }
            onScrub={handleScrub}
            onChange={handleChange}
          />
        </View>
      </ScrollView>

      <View className="px-5">
        <Button title={t('common.next')} icon="arrow-forward" disabled={!ready} onPress={onNext} />
      </View>
    </Animated.View>
  );
}
